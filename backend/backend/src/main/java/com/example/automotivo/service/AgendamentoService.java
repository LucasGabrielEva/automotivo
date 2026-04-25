package com.example.automotivo.service;

import com.example.automotivo.dto.*;
import com.example.automotivo.model.*;
import com.example.automotivo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepo;
    private final HistoricoAgendamentoRepository historicoRepo;
    private final ClienteRepository clienteRepo;
    private final OficinaParceiraRepository oficinaRepo;
    private final UsuarioRepository usuarioRepo;

    public AgendamentoService(AgendamentoRepository agendamentoRepo,
                              HistoricoAgendamentoRepository historicoRepo,
                              ClienteRepository clienteRepo,
                              OficinaParceiraRepository oficinaRepo,
                              UsuarioRepository usuarioRepo) {
        this.agendamentoRepo = agendamentoRepo;
        this.historicoRepo = historicoRepo;
        this.clienteRepo = clienteRepo;
        this.oficinaRepo = oficinaRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public List<AgendamentoResponseDTO> listarTodos() {
        return agendamentoRepo.findAllByOrderByDataHoraDesc()
                .stream().map(AgendamentoResponseDTO::from).collect(Collectors.toList());
    }

    public List<AgendamentoResponseDTO> listarPorStatus(StatusAgendamento status) {
        return agendamentoRepo.findByStatus(status)
                .stream().map(AgendamentoResponseDTO::from).collect(Collectors.toList());
    }

    public AgendamentoResponseDTO buscarPorId(Long id) {
        Agendamento a = agendamentoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado: " + id));
        return AgendamentoResponseDTO.from(a);
    }

    @Transactional
    public AgendamentoResponseDTO criar(AgendamentoRequestDTO dto) {
        Cliente cliente = clienteRepo.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + dto.getClienteId()));
        OficinaParceira oficina = oficinaRepo.findById(dto.getOficinaId())
                .orElseThrow(() -> new RuntimeException("Oficina não encontrada: " + dto.getOficinaId()));

        Agendamento a = new Agendamento();
        a.setCliente(cliente);
        a.setOficina(oficina);
        a.setDataHora(dto.getDataHora());
        a.setTipoServico(dto.getTipoServico());
        a.setStatus(StatusAgendamento.PENDENTE);

        return AgendamentoResponseDTO.from(agendamentoRepo.save(a));
    }

    @Transactional
    public AgendamentoResponseDTO reagendar(Long id, ReagendamentoRequestDTO dto) {
        Agendamento a = agendamentoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado: " + id));

        if (a.getStatus() == StatusAgendamento.CANCELADO) {
            throw new RuntimeException("Não é possível reagendar um agendamento cancelado.");
        }

        Usuario usuario = usuarioRepo.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + dto.getUsuarioId()));

        // Salva histórico antes de alterar
        HistoricoAgendamento hist = new HistoricoAgendamento();
        hist.setAgendamento(a);
        hist.setDataHoraAnterior(a.getDataHora());
        hist.setDataHoraNova(dto.getNovaDataHora());
        hist.setAlteradoPor(usuario);
        hist.setObservacao(dto.getObservacao());
        historicoRepo.save(hist);

        a.setDataHora(dto.getNovaDataHora());
        a.setStatus(StatusAgendamento.REAGENDADO);

        return AgendamentoResponseDTO.from(agendamentoRepo.save(a));
    }

    @Transactional
    public AgendamentoResponseDTO cancelar(Long id, CancelamentoRequestDTO dto) {
        Agendamento a = agendamentoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado: " + id));

        if (a.getStatus() == StatusAgendamento.CANCELADO) {
            throw new RuntimeException("Este agendamento já foi cancelado.");
        }

        Usuario canceladoPor = usuarioRepo.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + dto.getUsuarioId()));

        a.setStatus(StatusAgendamento.CANCELADO);
        a.setCanceladoPor(canceladoPor);
        a.setMotivoCancelamento(dto.getMotivo());

        return AgendamentoResponseDTO.from(agendamentoRepo.save(a));
    }

    public List<HistoricoAgendamentoResponseDTO> listarHistorico(Long agendamentoId) {
        return historicoRepo.findByAgendamentoIdOrderByDataAlteracaoDesc(agendamentoId)
                .stream().map(HistoricoAgendamentoResponseDTO::from).collect(Collectors.toList());
    }

    @Transactional
    public AgendamentoResponseDTO confirmar(Long id) {
        Agendamento a = agendamentoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado: " + id));
        if (a.getStatus() == StatusAgendamento.CANCELADO) {
            throw new RuntimeException("Não é possível confirmar um agendamento cancelado.");
        }
        a.setStatus(StatusAgendamento.CONFIRMADO);
        return AgendamentoResponseDTO.from(agendamentoRepo.save(a));
    }

    public void deletar(Long id) {
        if (!agendamentoRepo.existsById(id))
            throw new RuntimeException("Agendamento não encontrado: " + id);
        agendamentoRepo.deleteById(id);
    }
}
