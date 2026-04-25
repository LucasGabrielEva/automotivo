package com.example.automotivo.service;

import com.example.automotivo.dto.MensagemChatRequestDTO;
import com.example.automotivo.dto.MensagemChatResponseDTO;
import com.example.automotivo.model.MensagemChat;
import com.example.automotivo.model.OrdemServico;
import com.example.automotivo.model.Usuario;
import com.example.automotivo.repository.MensagemChatRepository;
import com.example.automotivo.repository.OrdemServicoRepository;
import com.example.automotivo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MensagemChatService {

    private final MensagemChatRepository mensagemRepo;
    private final OrdemServicoRepository ordemRepo;
    private final UsuarioRepository usuarioRepo;

    public MensagemChatService(MensagemChatRepository mensagemRepo,
                               OrdemServicoRepository ordemRepo,
                               UsuarioRepository usuarioRepo) {
        this.mensagemRepo = mensagemRepo;
        this.ordemRepo = ordemRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public List<MensagemChatResponseDTO> listarPorOrdem(Long ordemServicoId) {
        return mensagemRepo.findByOrdemServicoIdOrderByDataEnvioAsc(ordemServicoId).stream()
                .map(MensagemChatResponseDTO::from)
                .collect(Collectors.toList());
    }

    public MensagemChatResponseDTO enviar(MensagemChatRequestDTO dto) {
        OrdemServico os = ordemRepo.findById(dto.getOrdemServicoId())
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada com ID: " + dto.getOrdemServicoId()));
        Usuario remetente = usuarioRepo.findById(dto.getRemetenteId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + dto.getRemetenteId()));

        MensagemChat msg = new MensagemChat();
        msg.setOrdemServico(os);
        msg.setRemetente(remetente);
        msg.setMensagem(dto.getMensagem());

        return MensagemChatResponseDTO.from(mensagemRepo.save(msg));
    }
}
