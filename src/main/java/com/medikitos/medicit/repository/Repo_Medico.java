package com.medikitos.medicit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medikitos.medicit.entity.Medico;

public interface Repo_Medico extends JpaRepository<Medico, Long> {

    boolean existsByCedulaProfesional(String cedulaProfesional);

    @Query("SELECT DISTINCT m FROM Medico m LEFT JOIN FETCH m.especialidades me LEFT JOIN FETCH me.especialidad")
    List<Medico> findAllWithEspecialidades();

    @Query("SELECT m FROM Medico m LEFT JOIN FETCH m.especialidades me LEFT JOIN FETCH me.especialidad WHERE m.id = :id")
    Optional<Medico> findByIdWithEspecialidades(@Param("id") Long id);

}
