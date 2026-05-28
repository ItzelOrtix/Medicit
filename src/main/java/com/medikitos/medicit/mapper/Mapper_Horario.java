package com.medikitos.medicit.mapper;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import com.medikitos.medicit.dto.Dto_Horario;
import com.medikitos.medicit.entity.Horario;
import com.medikitos.medicit.entity.Medico;

public class Mapper_Horario {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    private Mapper_Horario() {
    }

    public static Horario toEntity(Dto_Horario dto, Medico medico) {
        Horario horario = new Horario();
        horario.setMedico(medico);
        horario.setDiaSemana(toJavaDayOfWeek(dto.getDiaSemana()));
        horario.setHoraInicio(dto.getHoraInicio() != null ? LocalTime.parse(dto.getHoraInicio()) : null);
        horario.setHoraFin(dto.getHoraFin() != null ? LocalTime.parse(dto.getHoraFin()) : null);
        horario.setActivo(dto.getDisponible() == null ? Boolean.TRUE : dto.getDisponible());
        horario.setFechaEspecifica(dto.getFechaEspecifica() != null ? LocalDate.parse(dto.getFechaEspecifica()) : null);
        horario.setCreatedAt(Instant.now());
        return horario;
    }

    public static Dto_Horario toDto(Horario horario) {
        Dto_Horario dto = new Dto_Horario();
        dto.setId(horario.getId());
        dto.setMedicoId(horario.getMedico().getId());
        dto.setMedicoNombre(horario.getMedico().getNombre());
        dto.setMedicoApellido(horario.getMedico().getApellido());
        dto.setDiaSemana(horario.getDiaSemana() != null ? toSpanish(horario.getDiaSemana()) : null);
        dto.setHoraInicio(horario.getHoraInicio() != null ? horario.getHoraInicio().format(TIME_FMT) : null);
        dto.setHoraFin(horario.getHoraFin() != null ? horario.getHoraFin().format(TIME_FMT) : null);
        dto.setDisponible(horario.getActivo());
        dto.setFechaEspecifica(horario.getFechaEspecifica() != null ? horario.getFechaEspecifica().toString() : null);
        dto.setCreatedAt(horario.getCreatedAt());
        dto.setUpdatedAt(horario.getUpdatedAt());
        dto.setDeletedAt(horario.getDeletedAt());
        return dto;
    }

    private static String toSpanish(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "LUNES";
            case TUESDAY -> "MARTES";
            case WEDNESDAY -> "MIERCOLES";
            case THURSDAY -> "JUEVES";
            case FRIDAY -> "VIERNES";
            case SATURDAY -> "SABADO";
            case SUNDAY -> "DOMINGO";
        };
    }

    private static DayOfWeek toJavaDayOfWeek(String spanishDay) {
        if (spanishDay == null) return null;
        return switch (spanishDay.toUpperCase()) {
            case "LUNES" -> DayOfWeek.MONDAY;
            case "MARTES" -> DayOfWeek.TUESDAY;
            case "MIERCOLES" -> DayOfWeek.WEDNESDAY;
            case "JUEVES" -> DayOfWeek.THURSDAY;
            case "VIERNES" -> DayOfWeek.FRIDAY;
            case "SABADO" -> DayOfWeek.SATURDAY;
            case "DOMINGO" -> DayOfWeek.SUNDAY;
            default -> throw new IllegalArgumentException("Día inválido: " + spanishDay);
        };
    }

}
