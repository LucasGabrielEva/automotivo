package com.example.automotivo.repository;

import com.example.automotivo.model.OrdemServico;
import com.example.automotivo.model.StatusOrdem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {
    List<OrdemServico> findByStatus(StatusOrdem status);
    List<OrdemServico> findByClienteId(Long clienteId);
    List<OrdemServico> findByResponsavelId(Long responsavelId);
}
