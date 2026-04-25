package com.example.automotivo.dto;

import com.example.automotivo.model.MensagemChat;
import java.time.LocalDateTime;

public class MensagemChatResponseDTO {
    private Long id;
    private Long ordemServicoId;
    private UsuarioResponseDTO remetente;
    private String mensagem;
    private LocalDateTime dataEnvio;

    public MensagemChatResponseDTO() {}

    public static MensagemChatResponseDTO from(MensagemChat m) {
        MensagemChatResponseDTO dto = new MensagemChatResponseDTO();
        dto.id = m.getId();
        dto.ordemServicoId = m.getOrdemServico().getId();
        dto.remetente = UsuarioResponseDTO.from(m.getRemetente());
        dto.mensagem = m.getMensagem();
        dto.dataEnvio = m.getDataEnvio();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOrdemServicoId() { return ordemServicoId; }
    public void setOrdemServicoId(Long ordemServicoId) { this.ordemServicoId = ordemServicoId; }
    public UsuarioResponseDTO getRemetente() { return remetente; }
    public void setRemetente(UsuarioResponseDTO remetente) { this.remetente = remetente; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }
}
