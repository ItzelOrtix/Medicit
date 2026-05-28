package com.medikitos.medicit.service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.dto.Dto_Cita;
import com.medikitos.medicit.entity.Cita;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.Paciente;
import com.medikitos.medicit.mapper.Mapper_Cita;
import com.medikitos.medicit.repository.Repo_Cita;
import com.medikitos.medicit.repository.Repo_Horario;
import com.medikitos.medicit.repository.Repo_Medico;
import com.medikitos.medicit.repository.Repo_Paciente;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Cita {

    @Autowired private Repo_Cita repoCita;
    @Autowired private Repo_Paciente repoPaciente;
    @Autowired private Repo_Medico repoMedico;
    @Autowired private Repo_Horario repoHorario;

    public List<Dto_Cita> getAll() {
        return repoCita.findByDeletedAtIsNull().stream().map(Mapper_Cita::toDto).collect(Collectors.toList());
    }

    public Dto_Cita getById(Long id) {
        return Mapper_Cita.toDto(obtenerCita(id));
    }

    public Dto_Cita create(Dto_Cita dto) {
        Paciente paciente = repoPaciente.findById(dto.getPacienteId())
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        Medico medico = repoMedico.findById(dto.getMedicoId())
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));
        validarDisponibilidad(dto);
        Cita cita = Mapper_Cita.toEntity(dto, paciente, medico);
        return Mapper_Cita.toDto(repoCita.save(cita));
    }

    private void validarDisponibilidad(Dto_Cita dto) {
        if (dto.getFecha() == null || dto.getHoraInicio() == null || dto.getHoraFin() == null) return;
        LocalDate fecha      = LocalDate.parse(dto.getFecha());
        LocalTime horaInicio = LocalTime.parse(dto.getHoraInicio());
        LocalTime horaFin    = LocalTime.parse(dto.getHoraFin());
        DayOfWeek diaSemana  = fecha.getDayOfWeek();
        var horarios = repoHorario.findByMedico_IdAndDiaSemanaAndActivoTrueAndDeletedAtIsNull(
                dto.getMedicoId(), diaSemana);
        boolean disponible = horarios.stream().anyMatch(h ->
                !horaInicio.isBefore(h.getHoraInicio()) && !horaFin.isAfter(h.getHoraFin()));
        if (!disponible) {
            throw new IllegalArgumentException(
                "El médico no tiene disponibilidad en ese horario. Verifica su horario laboral.");
        }
    }

    public Dto_Cita update(Long id, Dto_Cita dto) {
        Cita cita = obtenerCita(id);
        Paciente paciente = repoPaciente.findById(dto.getPacienteId())
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
        Medico medico = repoMedico.findById(dto.getMedicoId())
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));
        Mapper_Cita.actualizarEntity(cita, dto, paciente, medico);
        return Mapper_Cita.toDto(repoCita.save(cita));
    }

    public Dto_Cita cancelar(Long id) {
        Cita cita = obtenerCita(id);
        cita.setEstado("CANCELADA");
        cita.setUpdatedAt(Instant.now());
        return Mapper_Cita.toDto(repoCita.save(cita));
    }

    public void delete(Long id) {
        Cita cita = obtenerCita(id);
        cita.setDeletedAt(Instant.now());
        repoCita.save(cita);
    }

    private Cita obtenerCita(Long id) {
        return repoCita.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + id));
    }

}
