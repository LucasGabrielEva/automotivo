package com.example.automotivo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_agendamento")
public class HistoricoAgendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agendamento_id", nullable = false)
    private Agendamento agendamento;

    @Column(name = "data_hora_anterior", nullable = false)
    private LocalDateTime dataHoraAnterior;

    @Column(name = "data_hora_nova", nullable = false)
    private LocalDateTime dataHoraNova;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "alterado_por_id", nullable = false)
    private Usuario alteradoPor;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "data_alteracao")
    private LocalDateTime dataAlteracao;

    @PrePersist
    public void prePersist() {
        this.dataAlteracao = LocalDateTime.now();
    }

    public HistoricoAgendamento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Agendamento getAgendamento() { return agendamento; }
    public void setAgendamento(Agendamento agendamento) { this.agendamento = agendamento; }
    public LocalDateTime getDataHoraAnterior() { return dataHoraAnterior; }
    public void setDataHoraAnterior(LocalDateTime dataHoraAnterior) { this.dataHoraAnterior = dataHoraAnterior; }
    public LocalDateTime getDataHoraNova() { return dataHoraNova; }
    public void setDataHoraNova(LocalDateTime dataHoraNova) { this.dataHoraNova = dataHoraNova; }
    public Usuario getAlteradoPor() { return alteradoPor; }
    public void setAlteradoPor(Usuario alteradoPor) { this.alteradoPor = alteradoPor; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
    public LocalDateTime getDataAlteracao() { return dataAlteracao; }
    public void setDataAlteracao(LocalDateTime dataAlteracao) { this.dataAlteracao = dataAlteracao; }
}
