package com.example.automotivo.dto;

import com.example.automotivo.model.Perfil;
import com.example.automotivo.model.Usuario;
import java.time.LocalDateTime;

public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private Perfil perfil;
    private LocalDateTime dataCriacao;

    public UsuarioResponseDTO() {}

    public static UsuarioResponseDTO from(Usuario u) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.id = u.getId();
        dto.nome = u.getNome();
        dto.email = u.getEmail();
        dto.perfil = u.getPerfil();
        dto.dataCriacao = u.getDataCriacao();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
