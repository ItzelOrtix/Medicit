package com.medikitos.medicit.mapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import com.medikitos.medicit.dto.Dto_Cita;
import com.medikitos.medicit.entity.Cita;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.Paciente;

public class Mapper_Cita {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    private Mapper_Cita() {
    }

    public static Cita toEntity(Dto_Cita dto, Paciente paciente, Medico medico) {
        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setFecha(dto.getFecha() != null ? LocalDate.parse(dto.getFecha()) : null);
        cita.setHoraInicio(dto.getHoraInicio() != null ? LocalTime.parse(dto.getHoraInicio()) : null);
        cita.setHoraFin(dto.getHoraFin() != null ? LocalTime.parse(dto.getHoraFin()) : null);
        cita.setMotivo(dto.getMotivo());
        cita.setNotas(dto.getNotas());
        cita.setEstado(dto.getEstado() != null ? dto.getEstado() : "PENDIENTE");
        cita.setCreatedAt(Instant.now());
        return cita;
    }

    public static void actualizarEntity(Cita cita, Dto_Cita dto, Paciente paciente, Medico medico) {
        cita.setPaciente(paciente);
        cita.setMedico(medico);
        if (dto.getFecha() != null) cita.setFecha(LocalDate.parse(dto.getFecha()));
        if (dto.getHoraInicio() != null) cita.setHoraInicio(LocalTime.parse(dto.getHoraInicio()));
        if (dto.getHoraFin() != null) cita.setHoraFin(LocalTime.parse(dto.getHoraFin()));
        cita.setMotivo(dto.getMotivo());
        cita.setNotas(dto.getNotas());
        if (dto.getEstado() != null) cita.setEstado(dto.getEstado());
        cita.setUpdatedAt(Instant.now());
    }

    public static Dto_Cita toDto(Cita cita) {
        Dto_Cita dto = new Dto_Cita();
        dto.setId(cita.getId());
        dto.setPacienteId(cita.getPaciente().getId());
        dto.setPacienteNombre(cita.getPaciente().getNombre());
        dto.setPacienteApellido(cita.getPaciente().getApellido());
        dto.setMedicoId(cita.getMedico().getId());
        dto.setMedicoNombre(cita.getMedico().getNombre());
        dto.setMedicoApellido(cita.getMedico().getApellido());
        if (cita.getMedico().getEspecialidades() != null && !cita.getMedico().getEspecialidades().isEmpty()) {
            dto.setMedicoEspecialidad(cita.getMedico().getEspecialidades().get(0).getEspecialidad().getNombre());
        }
        dto.setEstado(cita.getEstado());
        dto.setFecha(cita.getFecha() != null ? cita.getFecha().toString() : null);
        dto.setHoraInicio(cita.getHoraInicio() != null ? cita.getHoraInicio().format(TIME_FMT) : null);
        dto.setHoraFin(cita.getHoraFin() != null ? cita.getHoraFin().format(TIME_FMT) : null);
        dto.setMotivo(cita.getMotivo());
        dto.setNotas(cita.getNotas());
        dto.setCreatedAt(cita.getCreatedAt());
        dto.setUpdatedAt(cita.getUpdatedAt());
        dto.setDeletedAt(cita.getDeletedAt());
        return dto;
    }

}
