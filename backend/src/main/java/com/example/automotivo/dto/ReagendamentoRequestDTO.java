package com.example.automotivo.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ReagendamentoRequestDTO {

    @NotNull(message = "A nova data e hora são obrigatórias")
    @FutureOrPresent(message = "A data deve ser no presente ou no futuro")
    private LocalDateTime novaDataHora;

    @NotNull(message = "O ID do usuário que está reagendando é obrigatório")
    private Long usuarioId;

    private String observacao;

    public ReagendamentoRequestDTO() {}

    public LocalDateTime getNovaDataHora() { return novaDataHora; }
    public void setNovaDataHora(LocalDateTime novaDataHora) { this.novaDataHora = novaDataHora; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
