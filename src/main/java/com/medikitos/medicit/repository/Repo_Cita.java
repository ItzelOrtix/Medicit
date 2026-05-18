package com.medikitos.medicit.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medikitos.medicit.entity.Cita;

public interface Repo_Cita extends JpaRepository<Cita, Long> {

    boolean existsByMedico_IdAndFechaAndHoraInicioAndHoraFinAndDeletedAtIsNull(
            Long medicoId, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin);

    List<Cita> findByMedico_IdAndFechaAndDeletedAtIsNull(Long medicoId, LocalDate fecha);

}
