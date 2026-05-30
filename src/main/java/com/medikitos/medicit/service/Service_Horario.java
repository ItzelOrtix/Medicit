package com.medikitos.medicit.service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
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
        return repoHorario.findByDeletedAtIsNull().stream().map(Mapper_Horario::toDto).collect(Collectors.toList());
    }

    public List<Dto_Horario> getByMedico(Long medicoId) {
        repoMedico.findById(medicoId)
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));
        return repoHorario.findByMedico_IdAndDeletedAtIsNull(medicoId)
                .stream().map(Mapper_Horario::toDto).collect(Collectors.toList());
    }

    public Dto_Horario create(Dto_Horario dto) {
        validarDuracionMinima(dto);
        Medico medico = repoMedico.findById(dto.getMedicoId())
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));
        Horario horario = Mapper_Horario.toEntity(dto, medico);
        return Mapper_Horario.toDto(repoHorario.save(horario));
    }

    public Dto_Horario update(Long id, Dto_Horario dto) {
        validarDuracionMinima(dto);
        Horario horario = obtenerHorario(id);
        Mapper_Horario.actualizarEntity(horario, dto);
        return Mapper_Horario.toDto(repoHorario.save(horario));
    }

    private void validarDuracionMinima(Dto_Horario dto) {
        if (dto.getHoraInicio() == null || dto.getHoraFin() == null) return;
        LocalTime inicio = LocalTime.parse(dto.getHoraInicio());
        LocalTime fin    = LocalTime.parse(dto.getHoraFin());
        if (Duration.between(inicio, fin).toMinutes() < 60) {
            throw new IllegalArgumentException("El turno debe tener al menos 1 hora de duración.");
        }
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
