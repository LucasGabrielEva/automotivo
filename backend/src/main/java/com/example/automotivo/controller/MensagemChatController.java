package com.example.automotivo.controller;

import com.example.automotivo.dto.MensagemChatRequestDTO;
import com.example.automotivo.dto.MensagemChatResponseDTO;
import com.example.automotivo.service.MensagemChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class MensagemChatController {

    private final MensagemChatService service;

    public MensagemChatController(MensagemChatService service) {
        this.service = service;
    }

    @GetMapping("/ordem/{ordemId}")
    public ResponseEntity<List<MensagemChatResponseDTO>> listarPorOrdem(@PathVariable Long ordemId) {
        return ResponseEntity.ok(service.listarPorOrdem(ordemId));
    }

    @PostMapping
    public ResponseEntity<MensagemChatResponseDTO> enviar(@Valid @RequestBody MensagemChatRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.enviar(dto));
    }
}
