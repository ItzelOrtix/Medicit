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

import com.medikitos.medicit.dto.Dto_Cita;
import com.medikitos.medicit.service.Service_Cita;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/cita")
@Tag(name = "Endpoints relacionados con citas", description = "Administración de citas médicas")
public class Controller_Cita {

    private final Service_Cita serviceCita;

    public Controller_Cita(Service_Cita serviceCita) {
        this.serviceCita = serviceCita;
    }

    @GetMapping
    @Operation(summary = "Obtener todas las citas")
    public ResponseEntity<List<Dto_Cita>> getAll() {
        return ResponseEntity.ok(serviceCita.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una cita por ID")
    public ResponseEntity<Dto_Cita> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceCita.getById(id));
    }

    @PostMapping
    @Operation(summary = "Crear una cita")
    public ResponseEntity<?> create(@RequestBody Dto_Cita dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(serviceCita.create(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una cita")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Dto_Cita dto) {
        try {
            return ResponseEntity.ok(serviceCita.update(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar una cita")
    public ResponseEntity<Dto_Cita> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(serviceCita.cancelar(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (soft delete) una cita")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceCita.delete(id);
        return ResponseEntity.noContent().build();
    }

}
