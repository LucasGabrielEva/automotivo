package com.example.automotivo.dto;

import com.example.automotivo.model.HistoricoAgendamento;
import java.time.LocalDateTime;

public class HistoricoAgendamentoResponseDTO {
    private Long id;
    private Long agendamentoId;
    private LocalDateTime dataHoraAnterior;
    private LocalDateTime dataHoraNova;
    private UsuarioResponseDTO alteradoPor;
    private String observacao;
    private LocalDateTime dataAlteracao;

    public HistoricoAgendamentoResponseDTO() {}

    public static HistoricoAgendamentoResponseDTO from(HistoricoAgendamento h) {
        HistoricoAgendamentoResponseDTO dto = new HistoricoAgendamentoResponseDTO();
        dto.id = h.getId();
        dto.agendamentoId = h.getAgendamento().getId();
        dto.dataHoraAnterior = h.getDataHoraAnterior();
        dto.dataHoraNova = h.getDataHoraNova();
        dto.alteradoPor = UsuarioResponseDTO.from(h.getAlteradoPor());
        dto.observacao = h.getObservacao();
        dto.dataAlteracao = h.getDataAlteracao();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAgendamentoId() { return agendamentoId; }
    public void setAgendamentoId(Long agendamentoId) { this.agendamentoId = agendamentoId; }
    public LocalDateTime getDataHoraAnterior() { return dataHoraAnterior; }
    public void setDataHoraAnterior(LocalDateTime v) { this.dataHoraAnterior = v; }
    public LocalDateTime getDataHoraNova() { return dataHoraNova; }
    public void setDataHoraNova(LocalDateTime v) { this.dataHoraNova = v; }
    public UsuarioResponseDTO getAlteradoPor() { return alteradoPor; }
    public void setAlteradoPor(UsuarioResponseDTO alteradoPor) { this.alteradoPor = alteradoPor; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public LocalDateTime getDataAlteracao() { return dataAlteracao; }
    public void setDataAlteracao(LocalDateTime dataAlteracao) { this.dataAlteracao = dataAlteracao; }
}
