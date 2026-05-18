package com.medikitos.medicit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medikitos.medicit.dto.Dto_Login;
import com.medikitos.medicit.dto.Dto_RegistroPaciente;
import com.medikitos.medicit.service.Service_Auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Registro de pacientes e inicio de sesión")
public class Controller_Auth {

    private final Service_Auth serviceAuth;

    public Controller_Auth(Service_Auth serviceAuth) {
        this.serviceAuth = serviceAuth;
    }

    @PostMapping("/registro/paciente")
    @Operation(summary = "Registrar paciente")
    public ResponseEntity<?> registrarPaciente(@RequestBody Dto_RegistroPaciente dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(serviceAuth.registrarPaciente(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión")
    public ResponseEntity<?> login(@RequestBody Dto_Login dto) {
        try {
            return ResponseEntity.ok(serviceAuth.login(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
