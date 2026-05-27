package com.medikitos.medicit.mapper;

import com.medikitos.medicit.dto.Dto_Especialidad;
import com.medikitos.medicit.entity.Especialidad;

public class Mapper_Especialidad {

    public static Especialidad toEntity(Dto_Especialidad dto) {

        Especialidad especialidad = new Especialidad();

        especialidad.setNombre(dto.getNombre().trim());
        especialidad.setDescripcion(dto.getDescripcion());

        return especialidad;
    }

    public static void actualizarEntity(Especialidad especialidad, Dto_Especialidad dto) {
        especialidad.setNombre(dto.getNombre().trim());
        especialidad.setDescripcion(dto.getDescripcion());
    }

    public static Dto_Especialidad toDto(Especialidad especialidad) {

        return new Dto_Especialidad(
                especialidad.getId(),
                especialidad.getNombre(),
                especialidad.getDescripcion());
    }

}
