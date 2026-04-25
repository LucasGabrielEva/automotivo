package com.example.automotivo.service;

import com.example.automotivo.dto.OficinaParceiroRequestDTO;
import com.example.automotivo.dto.OficinaParceiroResponseDTO;
import com.example.automotivo.model.OficinaParceira;
import com.example.automotivo.repository.OficinaParceiraRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OficinaService {

    private final OficinaParceiraRepository repository;

    public OficinaService(OficinaParceiraRepository repository) {
        this.repository = repository;
    }

    public List<OficinaParceiroResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(OficinaParceiroResponseDTO::from)
                .collect(Collectors.toList());
    }

    public OficinaParceiroResponseDTO buscarPorId(Long id) {
        OficinaParceira o = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oficina não encontrada com ID: " + id));
        return OficinaParceiroResponseDTO.from(o);
    }

    public OficinaParceiroResponseDTO criar(OficinaParceiroRequestDTO dto) {
        OficinaParceira o = new OficinaParceira();
        o.setNome(dto.getNome());
        o.setEndereco(dto.getEndereco());
        return OficinaParceiroResponseDTO.from(repository.save(o));
    }

    public OficinaParceiroResponseDTO atualizar(Long id, OficinaParceiroRequestDTO dto) {
        OficinaParceira o = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oficina não encontrada com ID: " + id));
        o.setNome(dto.getNome());
        o.setEndereco(dto.getEndereco());
        return OficinaParceiroResponseDTO.from(repository.save(o));
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Oficina não encontrada com ID: " + id);
        }
        repository.deleteById(id);
    }
}
