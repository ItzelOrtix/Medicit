package com.medikitos.medicit.service;

import java.time.Instant;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
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

    @Autowired
    private Repo_Horario repoHorario;

    @Autowired
    private Repo_Medico repoMedico;

    public Dto_Horario crearHorario(Long medicoId, Dto_Horario dto) {
        // Validar que el médico existe
        Medico medico = repoMedico.findById(medicoId)
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));

        // Validar que horaFin > horaInicio
        if (!dto.getHoraFin().isAfter(dto.getHoraInicio())) {
            throw new IllegalArgumentException("La hora de fin debe ser posterior a la hora de inicio");
        }

        // Necesitas al menos diaSemana O fechaEspecifica
        if (dto.getDiaSemana() == null && dto.getFechaEspecifica() == null) {
            throw new IllegalArgumentException("Debes indicar un día de la semana o una fecha específica");
        }

        Horario horario = Mapper_Horario.toEntity(dto, medico);
        return Mapper_Horario.toDto(repoHorario.save(horario));
    }

    public List<Dto_Horario> getByMedico(Long medicoId) {
        return repoHorario.findAll()
                .stream()
                .filter(h -> h.getMedico().getId().equals(medicoId) && h.getDeletedAt() == null)
                .map(Mapper_Horario::toDto)
                .collect(Collectors.toList());
    }

    public void eliminar(Long horarioId) {
        Horario h = repoHorario.findById(horarioId)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado"));
        h.setDeletedAt(Instant.now());
        repoHorario.save(h);
    }

}
