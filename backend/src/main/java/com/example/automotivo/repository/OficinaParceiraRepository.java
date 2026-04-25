package com.example.automotivo.repository;

import com.example.automotivo.model.OficinaParceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OficinaParceiraRepository extends JpaRepository<OficinaParceira, Long> {}
