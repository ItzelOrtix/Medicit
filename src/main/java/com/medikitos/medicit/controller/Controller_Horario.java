package com.medikitos.medicit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping
    @Operation(summary = "Obtener todos los horarios")
    public ResponseEntity<List<Dto_Horario>> getAll() {
        return ResponseEntity.ok(serviceHorario.getAll());
    }

    @GetMapping("/medico/{medicoId}")
    @Operation(summary = "Obtener horarios de un médico")
    public ResponseEntity<List<Dto_Horario>> getByMedico(@PathVariable Long medicoId) {
        return ResponseEntity.ok(serviceHorario.getByMedico(medicoId));
    }

    @PostMapping
    @Operation(summary = "Agregar un horario")
    public ResponseEntity<?> create(@RequestBody Dto_Horario dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(serviceHorario.create(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un horario")
    public ResponseEntity<Dto_Horario> update(@PathVariable Long id, @RequestBody Dto_Horario dto) {
        return ResponseEntity.ok(serviceHorario.update(id, dto));
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Alternar disponibilidad de un horario")
    public ResponseEntity<Dto_Horario> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(serviceHorario.toggleDisponibilidad(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (soft delete) un horario")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceHorario.delete(id);
        return ResponseEntity.noContent().build();
    }

}
