package com.medikitos.medicit.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.medikitos.medicit.dto.Dto_Paciente;
import com.medikitos.medicit.service.Service_Paciente;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/pacientes")
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

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un paciente existente")
    public ResponseEntity<Dto_Paciente> update(@PathVariable Long id, @RequestBody Dto_Paciente dto) {
        return ResponseEntity.ok(servicePaciente.update(id, dto));
    }

    // ── FOTO PERFIL ───────────────────────────────────────────────────────────

    @PutMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir o reemplazar foto de perfil del paciente")
    public ResponseEntity<Dto_Paciente> actualizarFoto(@PathVariable Long id,
            @RequestParam("foto") MultipartFile foto) {
        return ResponseEntity.ok(servicePaciente.actualizarFotoPerfil(id, foto));
    }

    @DeleteMapping("/{id}/foto")
    @Operation(summary = "Eliminar foto de perfil del paciente")
    public ResponseEntity<Dto_Paciente> eliminarFoto(@PathVariable Long id) {
        return ResponseEntity.ok(servicePaciente.eliminarFotoPerfil(id));
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (soft delete) un paciente")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        servicePaciente.delete(id);
        return ResponseEntity.noContent().build();
    }

}
