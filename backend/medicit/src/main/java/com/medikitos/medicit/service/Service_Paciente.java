package com.medikitos.medicit.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.dto.Dto_Paciente;
import com.medikitos.medicit.entity.Paciente;
import com.medikitos.medicit.mapper.Mapper_Paciente;
import com.medikitos.medicit.repository.Repo_Paciente;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Paciente {

    @Autowired
    private Repo_Paciente repoPaciente;

    // ── SELECT ────────────────────────────────────────────────────────────────

    public List<Dto_Paciente> getAll() {
        return repoPaciente.findAll()
                .stream()
                .map(Mapper_Paciente::toDto)
                .collect(Collectors.toList());
    }

    public Dto_Paciente getById(Long id) {
        Paciente paciente = repoPaciente.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con id: " + id));
        return Mapper_Paciente.toDto(paciente);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    public Dto_Paciente update(Long id, Dto_Paciente dto) {
        Paciente paciente = repoPaciente.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con id: " + id));

        Mapper_Paciente.actualizarEntity(paciente, dto);

        Paciente actualizado = repoPaciente.save(paciente);
        return Mapper_Paciente.toDto(actualizado);
    }

    // ── DELETE (soft) ─────────────────────────────────────────────────────────

    public void delete(Long id) {
        Paciente paciente = repoPaciente.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con id: " + id));
        paciente.setDeletedAt(Instant.now());
        repoPaciente.save(paciente);
    }

}
