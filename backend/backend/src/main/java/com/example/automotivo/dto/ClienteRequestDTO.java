package com.example.automotivo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClienteRequestDTO {
    @NotNull(message = "O ID do usuário é obrigatório")
    private Long usuarioId;

    private String razaoSocial;

    @NotBlank(message = "O documento (CPF/CNPJ) é obrigatório")
    private String documento;

    private String telefone;

    public ClienteRequestDTO() {}

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}
