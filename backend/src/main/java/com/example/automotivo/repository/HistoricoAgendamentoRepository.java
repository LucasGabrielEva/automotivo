package com.example.automotivo.repository;

import com.example.automotivo.model.HistoricoAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoricoAgendamentoRepository extends JpaRepository<HistoricoAgendamento, Long> {
    List<HistoricoAgendamento> findByAgendamentoIdOrderByDataAlteracaoDesc(Long agendamentoId);
}
