package com.example.automotivo.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class AgendamentoRequestDTO {

    @NotNull(message = "O ID do cliente é obrigatório")
    private Long clienteId;

    @NotNull(message = "O ID da oficina é obrigatório")
    private Long oficinaId;

    @NotNull(message = "A data e hora são obrigatórias")
    @FutureOrPresent(message = "A data deve ser no presente ou no futuro")
    private LocalDateTime dataHora;

    @NotBlank(message = "O tipo de serviço é obrigatório")
    private String tipoServico;

    public AgendamentoRequestDTO() {}

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Long getOficinaId() { return oficinaId; }
    public void setOficinaId(Long oficinaId) { this.oficinaId = oficinaId; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public String getTipoServico() { return tipoServico; }
    public void setTipoServico(String tipoServico) { this.tipoServico = tipoServico; }
}
