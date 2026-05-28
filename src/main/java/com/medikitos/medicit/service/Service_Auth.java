package com.medikitos.medicit.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medikitos.medicit.dto.Dto_Login;
import com.medikitos.medicit.dto.Dto_LoginResponse;
import com.medikitos.medicit.dto.Dto_Paciente;
import com.medikitos.medicit.dto.Dto_RegistroPaciente;
import com.medikitos.medicit.entity.Credencial;
import com.medikitos.medicit.entity.Paciente;
import com.medikitos.medicit.entity.Role;
import com.medikitos.medicit.mapper.Mapper_Login;
import com.medikitos.medicit.mapper.Mapper_Paciente;
import com.medikitos.medicit.repository.Repo_Credencial;
import com.medikitos.medicit.repository.Repo_Paciente;
import com.medikitos.medicit.repository.Repo_Role;
import com.medikitos.medicit.security.JwtService;
import com.medikitos.medicit.validator.Validator_Auth;
import com.medikitos.medicit.validator.Validator_Paciente;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Auth {

    private final Repo_Credencial repoCredencial;
    private final Repo_Paciente repoPaciente;
    private final Repo_Role repoRole;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Service_Auth(Repo_Credencial repoCredencial, Repo_Paciente repoPaciente, Repo_Role repoRole,
            PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.repoCredencial = repoCredencial;
        this.repoPaciente = repoPaciente;
        this.repoRole = repoRole;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Dto_Paciente registrarPaciente(Dto_RegistroPaciente dto) {
        Validator_Paciente.validarRegistro(dto);
        validarCredencialDisponible(dto.getCorreo());

        Role rolePaciente = obtenerRole("PACIENTE");

        Paciente paciente = Mapper_Paciente.toEntityRegistro(
                dto,
                rolePaciente,
                passwordEncoder.encode(dto.getContrasena()));

        return Mapper_Paciente.toDto(repoPaciente.save(paciente));
    }

    public Dto_LoginResponse login(Dto_Login dto) {
        Validator_Auth.validarLogin(dto);

        Credencial credencial = repoCredencial.findByCorreo(dto.getCorreo().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Correo o contraseña incorrectos"));

        if (credencial.getDeletedAt() != null || !passwordEncoder.matches(dto.getContrasena(), credencial.getContrasena())) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos");
        }

        String token = jwtService.generateToken(credencial);
        return Mapper_Login.toDto(credencial, token, jwtService.getExpirationWeb());
    }

    private void validarCredencialDisponible(String correo) {
        if (repoCredencial.existsByCorreo(correo.trim().toLowerCase())) {
            throw new IllegalArgumentException("El correo ya está registrado");
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
