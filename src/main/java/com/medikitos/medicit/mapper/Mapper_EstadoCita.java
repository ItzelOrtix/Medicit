package com.medikitos.medicit.mapper;

import com.medikitos.medicit.dto.Dto_EstadoCita;
import com.medikitos.medicit.entity.EstadoCita;

public class Mapper_EstadoCita {

    public static EstadoCita toEntity(Dto_EstadoCita dto) {

        EstadoCita estadoCita = new EstadoCita();

        estadoCita.setNombre(dto.getNombre());

        return estadoCita;
    }

    public static Dto_EstadoCita toDto(EstadoCita estadoCita) {

        return new Dto_EstadoCita(estadoCita.getNombre());
    }

}
