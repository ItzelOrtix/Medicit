package com.medikitos.medicit.mapper;

import java.time.Instant;

import com.medikitos.medicit.dto.Dto_Horario;
import com.medikitos.medicit.entity.Horario;
import com.medikitos.medicit.entity.Medico;

public class Mapper_Horario {

    public static Horario toEntity(Dto_Horario dto, Medico medico) {

        Horario horario = new Horario();

        horario.setMedico(medico);
        horario.setDiaSemana(dto.getDiaSemana());
        horario.setHoraInicio(dto.getHoraInicio());
        horario.setHoraFin(dto.getHoraFin());
        horario.setActivo(dto.getActivo() == null ? Boolean.TRUE : dto.getActivo());
        horario.setFechaEspecifica(dto.getFechaEspecifica());
        horario.setCreatedAt(Instant.now());

        return horario;
    }

    public static Dto_Horario toDto(Horario horario) {

        return new Dto_Horario(
                horario.getMedico().getId(),
                horario.getDiaSemana(),
                horario.getHoraInicio(),
                horario.getHoraFin(),
                horario.getActivo(),
                horario.getFechaEspecifica(),
                horario.getCreatedAt(),
                horario.getUpdatedAt(),
                horario.getDeletedAt());
    }

}
