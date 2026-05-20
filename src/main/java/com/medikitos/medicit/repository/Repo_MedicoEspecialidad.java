package com.medikitos.medicit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medikitos.medicit.entity.MedicoEspecialidad;

public interface Repo_MedicoEspecialidad extends JpaRepository<MedicoEspecialidad, Long> {

    boolean existsByMedico_IdAndEspecialidad_Id(Long medicoId, Long especialidadId);

    boolean existsByEspecialidad_Id(Long especialidadId);

}
