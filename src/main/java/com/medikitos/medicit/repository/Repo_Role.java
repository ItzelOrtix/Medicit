package com.medikitos.medicit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medikitos.medicit.entity.Role;

public interface Repo_Role extends JpaRepository<Role, Long> {

    Role findByNombre(String nombre);

}
