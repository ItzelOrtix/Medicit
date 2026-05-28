package com.medikitos.medicit.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.dto.Dto_Cita;
import com.medikitos.medicit.entity.Cita;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.Paciente;
import com.medikitos.medicit.mapper.Mapper_Cita;
import com.medikitos.medicit.repository.Repo_Cita;
import com.medikitos.medicit.repository.Repo_Medico;
import com.medikitos.medicit.repository.Repo_Paciente;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Cita {

    @Autowired private Repo_Cita repoCita;
    @Autowired private Repo_Paciente repoPaciente;
    @Autowired private Repo_Medico repoMedico;

    public List<Dto_Cita> getAll() {
        return repoCita.findAll().stream().map(Mapper_Cita::toDto).collect(Collectors.toList());
    }

    public Dto_Cita getById(Long id) {
        return Mapper_Cita.toDto(obtenerCita(id));
    }

    public Dto_Cita create(Dto_Cita dto) {
        Paciente paciente = repoPaciente.findById(dto.getPacienteId())
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        Medico medico = repoMedico.findById(dto.getMedicoId())
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));
        Cita cita = Mapper_Cita.toEntity(dto, paciente, medico);
        return Mapper_Cita.toDto(repoCita.save(cita));
    }

    public Dto_Cita update(Long id, Dto_Cita dto) {
        Cita cita = obtenerCita(id);
        Paciente paciente = repoPaciente.findById(dto.getPacienteId())
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        Medico medico = repoMedico.findById(dto.getMedicoId())
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));
        Mapper_Cita.actualizarEntity(cita, dto, paciente, medico);
        return Mapper_Cita.toDto(repoCita.save(cita));
    }

    public Dto_Cita cancelar(Long id) {
        Cita cita = obtenerCita(id);
        cita.setEstado("CANCELADA");
        cita.setUpdatedAt(Instant.now());
        return Mapper_Cita.toDto(repoCita.save(cita));
    }

    public void delete(Long id) {
        Cita cita = obtenerCita(id);
        cita.setDeletedAt(Instant.now());
        repoCita.save(cita);
    }

    private Cita obtenerCita(Long id) {
        return repoCita.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + id));
    }

}
