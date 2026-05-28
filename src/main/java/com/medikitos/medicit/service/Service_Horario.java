package com.medikitos.medicit.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.dto.Dto_Horario;
import com.medikitos.medicit.entity.Horario;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.mapper.Mapper_Horario;
import com.medikitos.medicit.repository.Repo_Horario;
import com.medikitos.medicit.repository.Repo_Medico;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Horario {

    @Autowired private Repo_Horario repoHorario;
    @Autowired private Repo_Medico repoMedico;

    public List<Dto_Horario> getAll() {
        return repoHorario.findAll().stream().map(Mapper_Horario::toDto).collect(Collectors.toList());
    }

    public List<Dto_Horario> getByMedico(Long medicoId) {
        Medico medico = repoMedico.findById(medicoId)
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));
        return repoHorario.findAll().stream()
                .filter(h -> h.getMedico().getId().equals(medicoId))
                .map(Mapper_Horario::toDto)
                .collect(Collectors.toList());
    }

    public Dto_Horario create(Dto_Horario dto) {
        Medico medico = repoMedico.findById(dto.getMedicoId())
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));
        Horario horario = Mapper_Horario.toEntity(dto, medico);
        return Mapper_Horario.toDto(repoHorario.save(horario));
    }

    public Dto_Horario toggleDisponibilidad(Long id) {
        Horario horario = obtenerHorario(id);
        horario.setActivo(!horario.getActivo());
        horario.setUpdatedAt(Instant.now());
        return Mapper_Horario.toDto(repoHorario.save(horario));
    }

    public void delete(Long id) {
        Horario horario = obtenerHorario(id);
        horario.setDeletedAt(Instant.now());
        repoHorario.save(horario);
    }

    private Horario obtenerHorario(Long id) {
        return repoHorario.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado con id: " + id));
    }

}
