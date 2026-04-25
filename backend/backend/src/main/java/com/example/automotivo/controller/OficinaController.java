package com.example.automotivo.controller;

import com.example.automotivo.dto.OficinaParceiroRequestDTO;
import com.example.automotivo.dto.OficinaParceiroResponseDTO;
import com.example.automotivo.service.OficinaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/oficinas")
public class OficinaController {

    private final OficinaService service;

    public OficinaController(OficinaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OficinaParceiroResponseDTO>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OficinaParceiroResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<OficinaParceiroResponseDTO> criar(@Valid @RequestBody OficinaParceiroRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OficinaParceiroResponseDTO> atualizar(@PathVariable Long id,
                                                                  @Valid @RequestBody OficinaParceiroRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
