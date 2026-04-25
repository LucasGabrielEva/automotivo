package com.example.automotivo.service;

import com.example.automotivo.dto.OrdemServicoRequestDTO;
import com.example.automotivo.dto.OrdemServicoResponseDTO;
import com.example.automotivo.model.*;
import com.example.automotivo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrdemServicoService {

    private final OrdemServicoRepository ordemRepo;
    private final ClienteRepository clienteRepo;
    private final UsuarioRepository usuarioRepo;
    private final MensagemChatRepository mensagemRepo;

    public OrdemServicoService(OrdemServicoRepository ordemRepo,
                               ClienteRepository clienteRepo,
                               UsuarioRepository usuarioRepo,
                               MensagemChatRepository mensagemRepo) {
        this.ordemRepo = ordemRepo;
        this.clienteRepo = clienteRepo;
        this.usuarioRepo = usuarioRepo;
        this.mensagemRepo = mensagemRepo;
    }

    public List<OrdemServicoResponseDTO> listarTodas() {
        return ordemRepo.findAll().stream()
                .map(OrdemServicoResponseDTO::from)
                .collect(Collectors.toList());
    }

    public OrdemServicoResponseDTO buscarPorId(Long id) {
        OrdemServico os = ordemRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada com ID: " + id));
        return OrdemServicoResponseDTO.from(os);
    }

    public List<OrdemServicoResponseDTO> listarPorStatus(StatusOrdem status) {
        return ordemRepo.findByStatus(status).stream()
                .map(OrdemServicoResponseDTO::from)
                .collect(Collectors.toList());
    }

    public OrdemServicoResponseDTO criar(OrdemServicoRequestDTO dto) {
        Cliente cliente = clienteRepo.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + dto.getClienteId()));

        OrdemServico os = new OrdemServico();
        os.setCliente(cliente);
        os.setModeloVeiculo(dto.getModeloVeiculo());
        os.setDescricaoProblema(dto.getDescricaoProblema());
        os.setStatus(StatusOrdem.ABERTA);

        if (dto.getResponsavelId() != null) {
            Usuario responsavel = usuarioRepo.findById(dto.getResponsavelId())
                    .orElseThrow(() -> new RuntimeException("Responsável não encontrado com ID: " + dto.getResponsavelId()));
            os.setResponsavel(responsavel);
        }

        OrdemServico saved = ordemRepo.save(os);

        // Se tem responsável, auto-criar mensagem inicial com a descrição do problema
        if (saved.getResponsavel() != null) {
            MensagemChat msg = new MensagemChat();
            msg.setOrdemServico(saved);
            msg.setRemetente(saved.getResponsavel());
            msg.setMensagem("📋 OS aberta. Problema relatado: " + dto.getDescricaoProblema());
            mensagemRepo.save(msg);
        }

        return OrdemServicoResponseDTO.from(saved);
    }

    public OrdemServicoResponseDTO atualizarStatus(Long id, StatusOrdem novoStatus, Long usuarioId) {
        OrdemServico os = ordemRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada com ID: " + id));

        // Validar permissão por perfil
        if (usuarioId != null) {
            Usuario usuario = usuarioRepo.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + usuarioId));
            validarPermissaoStatus(usuario, os.getStatus(), novoStatus);
        }

        StatusOrdem statusAnterior = os.getStatus();
        os.setStatus(novoStatus);
        if (novoStatus == StatusOrdem.FECHADA) {
            os.setDataFechamento(LocalDateTime.now());
        }

        OrdemServico saved = ordemRepo.save(os);

        // Registrar mudança de status no chat automaticamente
        if (usuarioId != null) {
            Usuario usuario = usuarioRepo.findById(usuarioId).orElse(null);
            if (usuario != null) {
                MensagemChat msg = new MensagemChat();
                msg.setOrdemServico(saved);
                msg.setRemetente(usuario);
                msg.setMensagem("🔄 Status atualizado: " + labelStatus(statusAnterior) + " → " + labelStatus(novoStatus));
                mensagemRepo.save(msg);
            }
        }

        return OrdemServicoResponseDTO.from(saved);
    }

    private void validarPermissaoStatus(Usuario usuario, StatusOrdem atual, StatusOrdem novo) {
        Perfil p = usuario.getPerfil();
        // CLIENTE não pode mudar status
        if (p == Perfil.CLIENTE) {
            throw new RuntimeException("Clientes não têm permissão para alterar o status da OS.");
        }
        // N1 pode: ABERTA → EM_ANDAMENTO ou AGUARDANDO_PECA
        if (p == Perfil.N1) {
            if (novo == StatusOrdem.FECHADA) {
                throw new RuntimeException("Atendentes N1 não podem fechar uma OS. Apenas N2 ou N3.");
            }
        }
        // N2 pode tudo exceto reabrir uma OS FECHADA
        if (p == Perfil.N2) {
            if (atual == StatusOrdem.FECHADA) {
                throw new RuntimeException("N2 não pode reabrir uma OS fechada. Apenas N3.");
            }
        }
        // N3 pode tudo
    }

    public OrdemServicoResponseDTO atribuirResponsavel(Long osId, Long responsavelId) {
        OrdemServico os = ordemRepo.findById(osId)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada com ID: " + osId));
        Usuario responsavel = usuarioRepo.findById(responsavelId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + responsavelId));
        os.setResponsavel(responsavel);
        return OrdemServicoResponseDTO.from(ordemRepo.save(os));
    }

    public void deletar(Long id) {
        if (!ordemRepo.existsById(id)) {
            throw new RuntimeException("Ordem de serviço não encontrada com ID: " + id);
        }
        mensagemRepo.deleteByOrdemServicoId(id);
        ordemRepo.deleteById(id);
    }

    @Transactional
    public void deletarTodas() {
        mensagemRepo.deleteAll();
        ordemRepo.deleteAll();
    }

    private String labelStatus(StatusOrdem s) {
        switch(s) {
            case ABERTA: return "Aberta";
            case EM_ANDAMENTO: return "Em andamento";
            case AGUARDANDO_PECA: return "Aguardando peça";
            case FECHADA: return "Fechada";
            default: return s.name();
        }
    }
}
