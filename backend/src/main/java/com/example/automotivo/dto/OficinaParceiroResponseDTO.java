package com.example.automotivo.dto;

import com.example.automotivo.model.OficinaParceira;

public class OficinaParceiroResponseDTO {
    private Long id;
    private String nome;
    private String endereco;

    public OficinaParceiroResponseDTO() {}

    public static OficinaParceiroResponseDTO from(OficinaParceira o) {
        OficinaParceiroResponseDTO dto = new OficinaParceiroResponseDTO();
        dto.id = o.getId();
        dto.nome = o.getNome();
        dto.endereco = o.getEndereco();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
}
