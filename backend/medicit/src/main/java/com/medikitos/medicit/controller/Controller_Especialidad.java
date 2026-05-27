package com.medikitos.medicit.controller;

import java.util.List;

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

import com.medikitos.medicit.dto.Dto_Especialidad;
import com.medikitos.medicit.service.Service_Especialidad;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/administrador/especialidades")
@Tag(name = "Endpoints relacionados con especialidades", description = "Administración de especialidades médicas")
public class Controller_Especialidad {

    private final Service_Especialidad serviceEspecialidad;

    public Controller_Especialidad(Service_Especialidad serviceEspecialidad) {
        this.serviceEspecialidad = serviceEspecialidad;
    }

    @GetMapping("/listar")
    @Operation(summary = "Obtener todas las especialidades")
    public ResponseEntity<List<Dto_Especialidad>> getAll() {
        return ResponseEntity.ok(serviceEspecialidad.getAll());
    }

    @PostMapping("/crear")
    @Operation(summary = "Crear especialidad")
    public ResponseEntity<?> create(@RequestBody Dto_Especialidad dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(serviceEspecialidad.create(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/modificar/{id}")
    @Operation(summary = "Modificar especialidad")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Dto_Especialidad dto) {
        try {
            return ResponseEntity.ok(serviceEspecialidad.update(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    @Operation(summary = "Eliminar especialidad")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            serviceEspecialidad.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/asignar-medico/{especialidadId}/{medicoId}")
    @Operation(summary = "Asignar especialidad a médico")
    public ResponseEntity<?> asignarAMedico(@PathVariable Long especialidadId, @PathVariable Long medicoId) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(serviceEspecialidad.asignarAMedico(medicoId, especialidadId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
