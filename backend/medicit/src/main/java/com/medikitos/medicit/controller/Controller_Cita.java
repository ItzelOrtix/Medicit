package com.medikitos.medicit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.medikitos.medicit.dto.Dto_Cita;
import com.medikitos.medicit.security.JwtService;
import com.medikitos.medicit.service.Service_Cita;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/pacientes/cita")
@Tag(name = "Endpoints relacionados con citas", description = "Administración de citas médicas")
public class Controller_Cita {

    private final Service_Cita serviceCita;
    private final JwtService jwtService;

    public Controller_Cita(Service_Cita serviceCita, JwtService jwtService) {
        this.serviceCita = serviceCita;
        this.jwtService = jwtService;
    }

    @PostMapping()
    @Operation(summary = "Crear una cita médica")
    public ResponseEntity<?> crearCita(
            @RequestBody Dto_Cita dto,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long pacienteId = jwtService.extractUserId(token);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(serviceCita.crearCita(dto, pacienteId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{citaId}")
    @Operation(summary = "Reprogramar una cita médica")
    public ResponseEntity<?> reprogramarCita(
        @PathVariable Long citaId,
        @RequestBody Dto_Cita dto) {
    try {
        String correo = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return ResponseEntity.ok(serviceCita.reprogramarCita(citaId, dto, correo));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @DeleteMapping("/{citaId}")
    @Operation(summary = "Cancelar una cita médica")
    public ResponseEntity<?> cancelarCita(@PathVariable Long citaId) {
    try {
        String correo = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        serviceCita.cancelarCita(citaId, correo);
        return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}
