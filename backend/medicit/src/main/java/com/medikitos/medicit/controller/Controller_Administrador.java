package com.medikitos.medicit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medikitos.medicit.dto.Dto_RegistroMedico;
import com.medikitos.medicit.service.Service_Administrador;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/administrador")
@Tag(name = "Administrador", description = "Operaciones exclusivas del administrador")
public class Controller_Administrador {

    private final Service_Administrador serviceAdministrador;

    public Controller_Administrador(Service_Administrador serviceAdministrador) {
        this.serviceAdministrador = serviceAdministrador;
    }

    @PostMapping("/medicos")
    @Operation(summary = "Registrar médico")
    public ResponseEntity<?> registrarMedico(@RequestBody Dto_RegistroMedico dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(serviceAdministrador.registrarMedico(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
