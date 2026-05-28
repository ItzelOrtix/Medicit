package com.medikitos.medicit.mapper;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.medikitos.medicit.dto.Dto_Especialidad;
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
        medico.setContrasena(contrasenaEncriptada);
        medico.setRol(rol);
        medico.setNombre(dto.getNombre().trim());
        medico.setApellido(dto.getApellido().trim());
        medico.setTelefono(dto.getTelefono().trim());
        medico.setCedulaProfesional(dto.getCedulaProfesional().trim());
        medico.setCreatedAt(Instant.now());

        return medico;
    }

    public static void actualizarEntity(Medico medico, Dto_Medico dto) {
        medico.setNombre(dto.getNombre());
        medico.setApellido(dto.getApellido());
        medico.setCorreo(dto.getCorreo());
        medico.setTelefono(dto.getTelefono());
        medico.setCedulaProfesional(dto.getCedulaProfesional());
        medico.setUpdatedAt(Instant.now());
    }

    public static Dto_Medico toDto(Medico medico) {

        Dto_Medico dto = new Dto_Medico(
                medico.getId(),
                medico.getNombre(),
                medico.getApellido(),
                medico.getCorreo(),
                medico.getTelefono(),
                medico.getCedulaProfesional(),
                medico.getCreatedAt(),
                medico.getUpdatedAt(),
                medico.getDeletedAt());

        List<Dto_Especialidad> especialidades = (medico.getEspecialidades() != null)
                ? medico.getEspecialidades().stream()
                        .map(me -> Mapper_Especialidad.toDto(me.getEspecialidad()))
                        .collect(Collectors.toList())
                : Collections.emptyList();
        dto.setEspecialidades(especialidades);

        return dto;
    }

}
