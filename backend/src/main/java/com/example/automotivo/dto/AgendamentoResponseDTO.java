package com.example.automotivo.dto;

import com.example.automotivo.model.Agendamento;
import com.example.automotivo.model.StatusAgendamento;
import java.time.LocalDateTime;

public class AgendamentoResponseDTO {
    private Long id;
    private ClienteResponseDTO cliente;
    private OficinaParceiroResponseDTO oficina;
    private LocalDateTime dataHora;
    private String tipoServico;
    private StatusAgendamento status;
    private UsuarioResponseDTO canceladoPor;
    private String motivoCancelamento;
    private LocalDateTime dataCriacao;

    public AgendamentoResponseDTO() {}

    public static AgendamentoResponseDTO from(Agendamento a) {
        AgendamentoResponseDTO dto = new AgendamentoResponseDTO();
        dto.id = a.getId();
        dto.cliente = ClienteResponseDTO.from(a.getCliente());
        dto.oficina = OficinaParceiroResponseDTO.from(a.getOficina());
        dto.dataHora = a.getDataHora();
        dto.tipoServico = a.getTipoServico();
        dto.status = a.getStatus();
        dto.canceladoPor = a.getCanceladoPor() != null ? UsuarioResponseDTO.from(a.getCanceladoPor()) : null;
        dto.motivoCancelamento = a.getMotivoCancelamento();
        dto.dataCriacao = a.getDataCriacao();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ClienteResponseDTO getCliente() { return cliente; }
    public void setCliente(ClienteResponseDTO cliente) { this.cliente = cliente; }
    public OficinaParceiroResponseDTO getOficina() { return oficina; }
    public void setOficina(OficinaParceiroResponseDTO oficina) { this.oficina = oficina; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public String getTipoServico() { return tipoServico; }
    public void setTipoServico(String tipoServico) { this.tipoServico = tipoServico; }
    public StatusAgendamento getStatus() { return status; }
    public void setStatus(StatusAgendamento status) { this.status = status; }
    public UsuarioResponseDTO getCanceladoPor() { return canceladoPor; }
    public void setCanceladoPor(UsuarioResponseDTO canceladoPor) { this.canceladoPor = canceladoPor; }
    public String getMotivoCancelamento() { return motivoCancelamento; }
    public void setMotivoCancelamento(String motivoCancelamento) { this.motivoCancelamento = motivoCancelamento; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
