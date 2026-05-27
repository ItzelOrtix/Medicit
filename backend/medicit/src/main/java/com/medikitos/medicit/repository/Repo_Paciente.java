package com.medikitos.medicit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medikitos.medicit.entity.Paciente;

public interface Repo_Paciente extends JpaRepository<Paciente, Long> {

}
