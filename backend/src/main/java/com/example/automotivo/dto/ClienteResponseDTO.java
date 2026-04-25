package com.example.automotivo.dto;

import com.example.automotivo.model.Cliente;

public class ClienteResponseDTO {
    private Long id;
    private UsuarioResponseDTO usuario;
    private String razaoSocial;
    private String documento;
    private String telefone;

    public ClienteResponseDTO() {}

    public static ClienteResponseDTO from(Cliente c) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.id = c.getId();
        dto.usuario = c.getUsuario() != null ? UsuarioResponseDTO.from(c.getUsuario()) : null;
        dto.razaoSocial = c.getRazaoSocial();
        dto.documento = c.getDocumento();
        dto.telefone = c.getTelefone();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UsuarioResponseDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioResponseDTO usuario) { this.usuario = usuario; }
    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}
