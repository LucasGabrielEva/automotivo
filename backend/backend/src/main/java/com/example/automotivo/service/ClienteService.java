package com.example.automotivo.service;

import com.example.automotivo.dto.ClienteRequestDTO;
import com.example.automotivo.dto.ClienteResponseDTO;
import com.example.automotivo.model.Cliente;
import com.example.automotivo.model.Usuario;
import com.example.automotivo.repository.ClienteRepository;
import com.example.automotivo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll().stream()
                .map(ClienteResponseDTO::from)
                .collect(Collectors.toList());
    }

    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente c = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));
        return ClienteResponseDTO.from(c);
    }

    public ClienteResponseDTO criar(ClienteRequestDTO dto) {
        if (clienteRepository.existsByDocumento(dto.getDocumento())) {
            throw new RuntimeException("Já existe um cliente com o documento: " + dto.getDocumento());
        }
        Cliente c = new Cliente();
        if (dto.getUsuarioId() != null) {
            Usuario u = usuarioRepository.findById(dto.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + dto.getUsuarioId()));
            c.setUsuario(u);
        }
        c.setRazaoSocial(dto.getRazaoSocial());
        c.setDocumento(dto.getDocumento());
        c.setTelefone(dto.getTelefone());
        return ClienteResponseDTO.from(clienteRepository.save(c));
    }

    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO dto) {
        Cliente c = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));
        c.setRazaoSocial(dto.getRazaoSocial());
        c.setDocumento(dto.getDocumento());
        c.setTelefone(dto.getTelefone());
        return ClienteResponseDTO.from(clienteRepository.save(c));
    }

    public void deletar(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado com ID: " + id);
        }
        clienteRepository.deleteById(id);
    }
}
