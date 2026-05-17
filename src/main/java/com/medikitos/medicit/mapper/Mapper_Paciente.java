package com.medikitos.medicit.mapper;

import java.time.Instant;

import com.medikitos.medicit.dto.Dto_Paciente;
import com.medikitos.medicit.entity.Paciente;

public class Mapper_Paciente {

    public static Paciente toEntity(Dto_Paciente dto) {

        Paciente paciente = new Paciente();

        paciente.setNombre(dto.getNombre());
        paciente.setApellido(dto.getApellido());
        paciente.setEmail(dto.getEmail());
        paciente.setTelefono(dto.getTelefono());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
        paciente.setGenero(dto.getGenero());
        paciente.setDireccion(dto.getDireccion());

        paciente.setCreatedAt(Instant.now());

        return paciente;
    }

    public static Dto_Paciente toDto(Paciente paciente) {

        return new Dto_Paciente(
                paciente.getNombre(),
                paciente.getApellido(),
                paciente.getEmail(),
                paciente.getTelefono(),
                paciente.getFechaNacimiento(),
                paciente.getGenero(),
                paciente.getDireccion(),
                paciente.getCreatedAt(),
                paciente.getUpdatedAt(),
                paciente.getDeletedAt());
    }

}