package com.medikitos.medicit.service;

import java.io.IOException;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.medikitos.medicit.dto.Dto_Medico;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.mapper.Mapper_Medico;
import com.medikitos.medicit.repository.Repo_Medico;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Medico {

    @Autowired
    private Repo_Medico repoMedico;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Dto_Medico> getAll() {
        return repoMedico.findAllWithEspecialidades()
                .stream()
                .map(Mapper_Medico::toDto)
                .collect(Collectors.toList());
    }

    public Dto_Medico getById(Long id) {
        Medico medico = repoMedico.findByIdWithEspecialidades(id)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado con id: " + id));
        return Mapper_Medico.toDto(medico);
    }

    public Dto_Medico update(Long id, Dto_Medico dto) {
        Medico medico = repoMedico.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado con id: " + id));
        Mapper_Medico.actualizarEntity(medico, dto);
        if (dto.getContrasena() != null && !dto.getContrasena().isBlank()) {
            medico.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        }
        return Mapper_Medico.toDto(repoMedico.save(medico));
    }

    public Dto_Medico actualizarFotoPerfil(Long id, MultipartFile foto) {
        Medico medico = repoMedico.findByIdWithEspecialidades(id)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado con id: " + id));
        try {
            String base64 = Base64.getEncoder().encodeToString(foto.getBytes());
            String mimeType = foto.getContentType() != null ? foto.getContentType() : "image/jpeg";
            medico.setFotoPerfil("data:" + mimeType + ";base64," + base64);
        } catch (IOException e) {
            throw new RuntimeException("Error al procesar la imagen");
        }
        medico.setUpdatedAt(Instant.now());
        return Mapper_Medico.toDto(repoMedico.save(medico));
    }

    public Dto_Medico eliminarFotoPerfil(Long id) {
        Medico medico = repoMedico.findByIdWithEspecialidades(id)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado con id: " + id));
        medico.setFotoPerfil(null);
        medico.setUpdatedAt(Instant.now());
        return Mapper_Medico.toDto(repoMedico.save(medico));
    }

    public void delete(Long id) {
        Medico medico = repoMedico.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado con id: " + id));
        medico.setDeletedAt(Instant.now());
        repoMedico.save(medico);
    }

}
