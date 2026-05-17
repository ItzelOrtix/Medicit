package com.medikitos.medicit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medikitos.medicit.entity.MedicoEspecialidad;
import com.medikitos.medicit.entity.MedicoEspecialidadId;

public interface Repo_MedicoEspecialidad extends JpaRepository<MedicoEspecialidad, MedicoEspecialidadId> {

}
