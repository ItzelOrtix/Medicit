package com.medikitos.medicit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medikitos.medicit.entity.Credencial;

public interface Repo_Credencial extends JpaRepository<Credencial, Long> {

    Optional<Credencial> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

}
