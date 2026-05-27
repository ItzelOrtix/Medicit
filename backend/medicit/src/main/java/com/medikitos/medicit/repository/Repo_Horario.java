package com.medikitos.medicit.repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medikitos.medicit.entity.Horario;

public interface Repo_Horario extends JpaRepository<Horario, Long> {

    List<Horario> findByMedico_IdAndDiaSemanaAndActivoTrueAndDeletedAtIsNull(Long medicoId, DayOfWeek diaSemana);

    List<Horario> findByMedico_IdAndFechaEspecificaAndActivoTrueAndDeletedAtIsNull(Long medicoId, LocalDate fecha);

}
