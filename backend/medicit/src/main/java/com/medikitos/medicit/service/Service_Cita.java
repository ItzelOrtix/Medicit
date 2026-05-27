package com.medikitos.medicit.service;

import java.time.DayOfWeek;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.dto.Dto_Cita;
import com.medikitos.medicit.entity.Cita;
import com.medikitos.medicit.entity.Horario;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.Paciente;
import com.medikitos.medicit.mapper.Mapper_Cita;
import com.medikitos.medicit.repository.Repo_Cita;
import com.medikitos.medicit.repository.Repo_Horario;
import com.medikitos.medicit.repository.Repo_Medico;
import com.medikitos.medicit.repository.Repo_Paciente;
import java.util.List;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Cita {

    @Autowired
    private Repo_Cita repoCita;
    
    @Autowired
    private Repo_Horario repoHorario;

    @Autowired
    private Repo_Paciente repoPaciente;

    @Autowired
    private Repo_Medico repoMedico;

    public Dto_Cita crearCita(Dto_Cita dto, Long pacienteId) {
    // Verifica que el médico tiene un horario que cubre la fecha y hora pedida
    DayOfWeek dia = dto.getFecha().getDayOfWeek();

    List<Horario> horariosDia = repoHorario
            .findByMedico_IdAndDiaSemanaAndActivoTrueAndDeletedAtIsNull(dto.getMedicoId(), dia);

    boolean dentroDeHorario = horariosDia.stream().anyMatch(h ->
            !dto.getHoraInicio().isBefore(h.getHoraInicio()) &&
            !dto.getHoraFin().isAfter(h.getHoraFin())
    );

    if (!dentroDeHorario) {
        throw new IllegalArgumentException("El médico no tiene horario disponible en ese momento");
    }

    // Verificar que no haya conflicto con otra cita ya existente
    boolean hayConflicto = repoCita
            .existsByMedico_IdAndFechaAndHoraInicioAndHoraFinAndDeletedAtIsNull(
                    dto.getMedicoId(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());

    if (hayConflicto) {
        throw new IllegalArgumentException("El médico ya tiene una cita en ese horario");
    }

    // Guardar la cita
    Paciente paciente = repoPaciente.findById(pacienteId)
            .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado"));
    Medico medico = repoMedico.findById(dto.getMedicoId())
            .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));

    Cita cita = Mapper_Cita.toEntity(dto, paciente, medico);
    return Mapper_Cita.toDto(repoCita.save(cita));
}

public Dto_Cita reprogramarCita(Long citaId, Dto_Cita dto, String correo) {
    // Verifica que la cita existe y pertenece al paciente
    Cita cita = repoCita.findByIdAndPaciente_CorreoAndDeletedAtIsNull(citaId, correo)
            .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada o no te pertenece"));

    // Verifica que el médico tiene horario en el nuevo horario pedido
    DayOfWeek dia = dto.getFecha().getDayOfWeek();
    List<Horario> horariosDia = repoHorario
            .findByMedico_IdAndDiaSemanaAndActivoTrueAndDeletedAtIsNull(cita.getMedico().getId(), dia);

    boolean dentroDeHorario = horariosDia.stream().anyMatch(h ->
            !dto.getHoraInicio().isBefore(h.getHoraInicio()) &&
            !dto.getHoraFin().isAfter(h.getHoraFin())
    );

    if (!dentroDeHorario) {
        throw new IllegalArgumentException("El médico no tiene horario disponible en ese momento");
    }

    // Verifica que no haya conflicto con otra cita en ese nuevo horario
    boolean hayConflicto = repoCita
            .existsByMedico_IdAndFechaAndHoraInicioAndHoraFinAndDeletedAtIsNull(
                    cita.getMedico().getId(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());

    if (hayConflicto) {
        throw new IllegalArgumentException("El médico ya tiene una cita en ese horario");
    }

    // Actualiza la cita
    cita.setFecha(dto.getFecha());
    cita.setHoraInicio(dto.getHoraInicio());
    cita.setHoraFin(dto.getHoraFin());
    cita.setMotivo(dto.getMotivo());
    cita.setNotas(dto.getNotas());
    cita.setUpdatedAt(Instant.now());

    return Mapper_Cita.toDto(repoCita.save(cita));
}

public void cancelarCita(Long citaId, String correo) {
    // Verifica que la cita existe y pertenece al paciente
    Cita cita = repoCita.findByIdAndPaciente_CorreoAndDeletedAtIsNull(citaId, correo)
            .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada o no te pertenece"));

    cita.setDeletedAt(Instant.now());
    repoCita.save(cita);
}

}


