package com.example.automotivo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CancelamentoRequestDTO {

    @NotNull(message = "O ID do usuário que está cancelando é obrigatório")
    private Long usuarioId;

    @NotBlank(message = "O motivo do cancelamento é obrigatório")
    private String motivo;

    public CancelamentoRequestDTO() {}

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}
