package com.medikitos.medicit.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medikitos.medicit.dto.Dto_Paciente;
import com.medikitos.medicit.service.Service_Paciente;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/paciente")
@Tag(name = "Endpoints relacionados con pacientes", description = "Administración de pacientes")
public class Controller_Paciente {

    @Autowired
    private Service_Paciente servicePaciente;

    // ── SELECT todos ──────────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Obtener todos los pacientes")
    public ResponseEntity<List<Dto_Paciente>> getAll() {
        return ResponseEntity.ok(servicePaciente.getAll());
    }

    // ── SELECT por id ─────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un paciente por ID")
    public ResponseEntity<Dto_Paciente> getById(@PathVariable Long id) {
        return ResponseEntity.ok(servicePaciente.getById(id));
    }

    // ── INSERT ────────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Crear un nuevo paciente")
    public ResponseEntity<Dto_Paciente> create(@RequestBody Dto_Paciente dto) {
        Dto_Paciente creado = servicePaciente.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un paciente existente")
    public ResponseEntity<Dto_Paciente> update(@PathVariable Long id, @RequestBody Dto_Paciente dto) {
        return ResponseEntity.ok(servicePaciente.update(id, dto));
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (soft delete) un paciente")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        servicePaciente.delete(id);
        return ResponseEntity.noContent().build();
    }

}
