package com.example.automotivo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MensagemChatRequestDTO {
    @NotNull(message = "O ID da Ordem de Serviço é obrigatório")
    private Long ordemServicoId;

    @NotNull(message = "O remetente é obrigatório")
    private Long remetenteId;

    @NotBlank(message = "A mensagem não pode estar vazia")
    private String mensagem;

    public MensagemChatRequestDTO() {}

    public Long getOrdemServicoId() { return ordemServicoId; }
    public void setOrdemServicoId(Long ordemServicoId) { this.ordemServicoId = ordemServicoId; }
    public Long getRemetenteId() { return remetenteId; }
    public void setRemetenteId(Long remetenteId) { this.remetenteId = remetenteId; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
}
