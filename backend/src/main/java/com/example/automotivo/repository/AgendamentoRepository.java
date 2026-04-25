package com.example.automotivo.repository;

import com.example.automotivo.model.Agendamento;
import com.example.automotivo.model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByClienteId(Long clienteId);
    List<Agendamento> findByOficinaId(Long oficinaId);
    List<Agendamento> findByStatus(StatusAgendamento status);
    List<Agendamento> findAllByOrderByDataHoraDesc();
}
