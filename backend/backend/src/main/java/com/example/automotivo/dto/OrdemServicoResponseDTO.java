package com.example.automotivo.dto;

import com.example.automotivo.model.OrdemServico;
import com.example.automotivo.model.StatusOrdem;
import java.time.LocalDateTime;

public class OrdemServicoResponseDTO {
    private Long id;
    private ClienteResponseDTO cliente;
    private String modeloVeiculo;
    private String descricaoProblema;
    private StatusOrdem status;
    private UsuarioResponseDTO responsavel;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataFechamento;

    public OrdemServicoResponseDTO() {}

    public static OrdemServicoResponseDTO from(OrdemServico os) {
        OrdemServicoResponseDTO dto = new OrdemServicoResponseDTO();
        dto.id = os.getId();
        dto.cliente = ClienteResponseDTO.from(os.getCliente());
        dto.modeloVeiculo = os.getModeloVeiculo();
        dto.descricaoProblema = os.getDescricaoProblema();
        dto.status = os.getStatus();
        dto.responsavel = os.getResponsavel() != null ? UsuarioResponseDTO.from(os.getResponsavel()) : null;
        dto.dataCriacao = os.getDataCriacao();
        dto.dataFechamento = os.getDataFechamento();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ClienteResponseDTO getCliente() { return cliente; }
    public void setCliente(ClienteResponseDTO cliente) { this.cliente = cliente; }
    public String getModeloVeiculo() { return modeloVeiculo; }
    public void setModeloVeiculo(String modeloVeiculo) { this.modeloVeiculo = modeloVeiculo; }
    public String getDescricaoProblema() { return descricaoProblema; }
    public void setDescricaoProblema(String descricaoProblema) { this.descricaoProblema = descricaoProblema; }
    public StatusOrdem getStatus() { return status; }
    public void setStatus(StatusOrdem status) { this.status = status; }
    public UsuarioResponseDTO getResponsavel() { return responsavel; }
    public void setResponsavel(UsuarioResponseDTO responsavel) { this.responsavel = responsavel; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    public LocalDateTime getDataFechamento() { return dataFechamento; }
    public void setDataFechamento(LocalDateTime dataFechamento) { this.dataFechamento = dataFechamento; }
}
