package com.medikitos.medicit.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        return repoMedico.findAll()
                .stream()
                .map(Mapper_Medico::toDto)
                .collect(Collectors.toList());
    }

    public Dto_Medico getById(Long id) {
        Medico medico = repoMedico.findById(id)
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

    public void delete(Long id) {
        Medico medico = repoMedico.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado con id: " + id));
        medico.setDeletedAt(Instant.now());
        repoMedico.save(medico);
    }

}
