package com.medikitos.medicit.mapper;

import java.time.Instant;

import com.medikitos.medicit.dto.Dto_Paciente;
import com.medikitos.medicit.dto.Dto_RegistroPaciente;
import com.medikitos.medicit.entity.Paciente;
import com.medikitos.medicit.entity.Role;

public class Mapper_Paciente {

    private Mapper_Paciente() {
    }

    public static Paciente toEntityRegistro(Dto_RegistroPaciente dto, Role rol, String contrasenaEncriptada) {

        Paciente paciente = new Paciente();

        paciente.setCorreo(dto.getCorreo().trim().toLowerCase());
        paciente.setContrasena(contrasenaEncriptada);
        paciente.setRol(rol);
        paciente.setNombre(dto.getNombre().trim());
        paciente.setApellido(dto.getApellido().trim());
        paciente.setTelefono(dto.getTelefono().trim());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
        paciente.setGenero(dto.getGenero().trim());
        paciente.setDireccion(dto.getDireccion());
        paciente.setCreatedAt(Instant.now());

        return paciente;
    }

    public static void actualizarEntity(Paciente paciente, Dto_Paciente dto) {
        paciente.setNombre(dto.getNombre());
        paciente.setApellido(dto.getApellido());
        paciente.setCorreo(dto.getCorreo());
        paciente.setTelefono(dto.getTelefono());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
        paciente.setGenero(dto.getGenero());
        paciente.setDireccion(dto.getDireccion());
        paciente.setUpdatedAt(Instant.now());
    }

    public static Dto_Paciente toDto(Paciente paciente) {

        return new Dto_Paciente(
                paciente.getId(),
                paciente.getNombre(),
                paciente.getApellido(),
                paciente.getCorreo(),
                paciente.getTelefono(),
                paciente.getFechaNacimiento(),
                paciente.getGenero(),
                paciente.getDireccion(),
                paciente.getFotoPerfil(),
                paciente.getCreatedAt(),
                paciente.getUpdatedAt(),
                paciente.getDeletedAt());
    }

}
