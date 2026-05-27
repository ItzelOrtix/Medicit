package com.medikitos.medicit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.medikitos.medicit.dto.Dto_Horario;
import com.medikitos.medicit.service.Service_Horario;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/horarios")
@Tag(name = "Endpoints relacionados con horarios", description = "Administración de horarios de médicos")


public class Controller_Horario {

private final Service_Horario serviceHorario;

public Controller_Horario(Service_Horario serviceHorario) {
    this.serviceHorario = serviceHorario;
}

    @PostMapping("/medico/{medicoId}")
@Operation(summary = "Asignar horario a un médico")
public ResponseEntity<?> crearHorario(
        @PathVariable Long medicoId,
        @RequestBody Dto_Horario dto) {
    try {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceHorario.crearHorario(medicoId, dto));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@GetMapping("/medico/{medicoId}")
@Operation(summary = "Ver horarios de un médico")
public ResponseEntity<?> getByMedico(@PathVariable Long medicoId) {
    return ResponseEntity.ok(serviceHorario.getByMedico(medicoId));
}

@DeleteMapping("/{horarioId}")
@Operation(summary = "Eliminar (soft delete) un horario")
public ResponseEntity<?> eliminar(@PathVariable Long horarioId) {
    try {
        serviceHorario.eliminar(horarioId);
        return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}
