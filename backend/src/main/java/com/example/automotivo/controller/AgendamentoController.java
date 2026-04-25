package com.example.automotivo.controller;

import com.example.automotivo.dto.*;
import com.example.automotivo.model.StatusAgendamento;
import com.example.automotivo.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listarTodos(
            @RequestParam(required = false) StatusAgendamento status) {
        if (status != null) return ResponseEntity.ok(service.listarPorStatus(status));
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criar(@Valid @RequestBody AgendamentoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PatchMapping("/{id}/reagendar")
    public ResponseEntity<AgendamentoResponseDTO> reagendar(
            @PathVariable Long id,
            @Valid @RequestBody ReagendamentoRequestDTO dto) {
        return ResponseEntity.ok(service.reagendar(id, dto));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponseDTO> cancelar(
            @PathVariable Long id,
            @Valid @RequestBody CancelamentoRequestDTO dto) {
        return ResponseEntity.ok(service.cancelar(id, dto));
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<AgendamentoResponseDTO> confirmar(@PathVariable Long id) {
        return ResponseEntity.ok(service.confirmar(id));
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoAgendamentoResponseDTO>> historico(@PathVariable Long id) {
        return ResponseEntity.ok(service.listarHistorico(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
