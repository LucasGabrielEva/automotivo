package com.example.automotivo.repository;

import com.example.automotivo.model.MensagemChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface MensagemChatRepository extends JpaRepository<MensagemChat, Long> {
    List<MensagemChat> findByOrdemServicoIdOrderByDataEnvioAsc(Long ordemServicoId);

    @Modifying
    @Transactional
    @Query("DELETE FROM MensagemChat m WHERE m.ordemServico.id = :ordemId")
    void deleteByOrdemServicoId(Long ordemId);
}
