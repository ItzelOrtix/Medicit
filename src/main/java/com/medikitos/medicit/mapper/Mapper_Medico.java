package com.medikitos.medicit.mapper;

import java.time.Instant;

import com.medikitos.medicit.dto.Dto_Medico;
import com.medikitos.medicit.entity.Medico;

public class Mapper_Medico {

    public static Medico toEntity(Dto_Medico dto) {

        Medico medico = new Medico();

        medico.setNombre(dto.getNombre());
        medico.setApellido(dto.getApellido());
        medico.setEmail(dto.getEmail());
        medico.setTelefono(dto.getTelefono());
        medico.setCedulaProfesional(dto.getCedulaProfesional());
        medico.setCreatedAt(Instant.now());

        return medico;
    }

    public static Dto_Medico toDto(Medico medico) {

        return new Dto_Medico(
                medico.getNombre(),
                medico.getApellido(),
                medico.getEmail(),
                medico.getTelefono(),
                medico.getCedulaProfesional(),
                medico.getCreatedAt(),
                medico.getUpdatedAt(),
                medico.getDeletedAt());
    }

}
