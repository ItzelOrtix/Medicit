package com.medikitos.medicit.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.dto.Dto_Medico;
import com.medikitos.medicit.dto.Dto_RegistroMedico;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.Role;
import com.medikitos.medicit.mapper.Mapper_Medico;
import com.medikitos.medicit.repository.Repo_Credencial;
import com.medikitos.medicit.repository.Repo_Medico;
import com.medikitos.medicit.repository.Repo_Role;
import com.medikitos.medicit.validator.Validator_Medico;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Administrador {

    private final Repo_Credencial repoCredencial;
    private final Repo_Medico repoMedico;
    private final Repo_Role repoRole;
    private final PasswordEncoder passwordEncoder;

    public Service_Administrador(Repo_Credencial repoCredencial, Repo_Medico repoMedico, Repo_Role repoRole,
            PasswordEncoder passwordEncoder) {
        this.repoCredencial = repoCredencial;
        this.repoMedico = repoMedico;
        this.repoRole = repoRole;
        this.passwordEncoder = passwordEncoder;
    }

    public Dto_Medico registrarMedico(Dto_RegistroMedico dto) {
        Validator_Medico.validarRegistro(dto);
        validarCredencialDisponible(dto.getCorreo(), dto.getUsuario());
        if (repoMedico.existsByCedulaProfesional(dto.getCedulaProfesional().trim())) {
            throw new IllegalArgumentException("La cédula profesional ya está registrada");
        }

        Role roleMedico = obtenerRole("MEDICO");

        Medico medico = Mapper_Medico.toEntityRegistro(
                dto,
                roleMedico,
                passwordEncoder.encode(dto.getContrasena()));

        return Mapper_Medico.toDto(repoMedico.save(medico));
    }

    private void validarCredencialDisponible(String correo, String usuario) {
        if (repoCredencial.existsByCorreo(correo.trim().toLowerCase())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        if (repoCredencial.existsByUsuario(usuario.trim())) {
            throw new IllegalArgumentException("El usuario ya está registrado");
        }
    }

    private Role obtenerRole(String nombre) {
        Role role = repoRole.findByNombre(nombre);
        if (role == null) {
            throw new IllegalArgumentException("Rol no encontrado: " + nombre);
        }
        return role;
    }

}
