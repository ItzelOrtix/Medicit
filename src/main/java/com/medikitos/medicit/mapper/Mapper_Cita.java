package com.medikitos.medicit.mapper;

import java.time.Instant;

import com.medikitos.medicit.dto.Dto_Cita;
import com.medikitos.medicit.entity.Cita;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.Paciente;

public class Mapper_Cita {

    private Mapper_Cita() {
    }

    public static Cita toEntity(Dto_Cita dto, Paciente paciente, Medico medico) {

        Cita cita = new Cita();

        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setFecha(dto.getFecha());
        cita.setHoraInicio(dto.getHoraInicio());
        cita.setHoraFin(dto.getHoraFin());
        cita.setMotivo(dto.getMotivo());
        cita.setNotas(dto.getNotas());
        cita.setCreatedAt(Instant.now());

        return cita;
    }

    public static Dto_Cita toDto(Cita cita) {

        return new Dto_Cita(
                cita.getPaciente().getId(),
                cita.getMedico().getId(),
                cita.getFecha(),
                cita.getHoraInicio(),
                cita.getHoraFin(),
                cita.getMotivo(),
                cita.getNotas(),
                cita.getCreatedAt(),
                cita.getUpdatedAt(),
                cita.getDeletedAt());
    }

}
