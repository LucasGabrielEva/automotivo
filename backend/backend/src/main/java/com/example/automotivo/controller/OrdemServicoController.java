package com.example.automotivo.controller;

import com.example.automotivo.dto.OrdemServicoRequestDTO;
import com.example.automotivo.dto.OrdemServicoResponseDTO;
import com.example.automotivo.model.StatusOrdem;
import com.example.automotivo.service.OrdemServicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordens")
public class OrdemServicoController {

    private final OrdemServicoService service;

    public OrdemServicoController(OrdemServicoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OrdemServicoResponseDTO>> listarTodas(
            @RequestParam(required = false) StatusOrdem status) {
        if (status != null) {
            return ResponseEntity.ok(service.listarPorStatus(status));
        }
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdemServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<OrdemServicoResponseDTO> criar(@Valid @RequestBody OrdemServicoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrdemServicoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusOrdem status,
            @RequestParam(required = false) Long usuarioId) {
        return ResponseEntity.ok(service.atualizarStatus(id, status, usuarioId));
    }

    @PatchMapping("/{id}/responsavel")
    public ResponseEntity<OrdemServicoResponseDTO> atribuirResponsavel(
            @PathVariable Long id,
            @RequestParam Long responsavelId) {
        return ResponseEntity.ok(service.atribuirResponsavel(id, responsavelId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/todas")
    public ResponseEntity<Map<String, String>> deletarTodas() {
        service.deletarTodas();
        return ResponseEntity.ok(Map.of("mensagem", "Todas as ordens de serviço foram excluídas."));
    }
}
