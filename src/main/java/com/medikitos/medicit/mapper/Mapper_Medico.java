package com.medikitos.medicit.mapper;

import java.time.Instant;

import com.medikitos.medicit.dto.Dto_Medico;
import com.medikitos.medicit.dto.Dto_RegistroMedico;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.Role;

public class Mapper_Medico {

    private Mapper_Medico() {
    }

    public static Medico toEntityRegistro(Dto_RegistroMedico dto, Role rol, String contrasenaEncriptada) {

        Medico medico = new Medico();

        medico.setCorreo(dto.getCorreo().trim().toLowerCase());
        medico.setUsuario(dto.getUsuario().trim());
        medico.setContrasena(contrasenaEncriptada);
        medico.setRol(rol);
        medico.setNombre(dto.getNombre().trim());
        medico.setApellido(dto.getApellido().trim());
        medico.setTelefono(dto.getTelefono().trim());
        medico.setCedulaProfesional(dto.getCedulaProfesional().trim());
        medico.setCreatedAt(Instant.now());

        return medico;
    }

    public static Dto_Medico toDto(Medico medico) {

        return new Dto_Medico(
                medico.getNombre(),
                medico.getApellido(),
                medico.getCorreo(),
                medico.getTelefono(),
                medico.getCedulaProfesional(),
                medico.getCreatedAt(),
                medico.getUpdatedAt(),
                medico.getDeletedAt());
    }

}
