package com.example.automotivo.dto;

import jakarta.validation.constraints.NotBlank;

public class OficinaParceiroRequestDTO {
    @NotBlank(message = "O nome da oficina é obrigatório")
    private String nome;

    @NotBlank(message = "O endereço é obrigatório")
    private String endereco;

    public OficinaParceiroRequestDTO() {}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
}
