package com.medikitos.medicit.controller;

import java.util.List;

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

import com.medikitos.medicit.dto.Dto_Medico;
import com.medikitos.medicit.service.Service_Medico;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/medicos")
@Tag(name = "Endpoints relacionados con médicos", description = "Administración de médicos")
public class Controller_Medico {

    private final Service_Medico serviceMedico;

    public Controller_Medico(Service_Medico serviceMedico) {
        this.serviceMedico = serviceMedico;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los médicos")
    public ResponseEntity<List<Dto_Medico>> getAll() {
        return ResponseEntity.ok(serviceMedico.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un médico por ID")
    public ResponseEntity<Dto_Medico> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceMedico.getById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un médico existente")
    public ResponseEntity<Dto_Medico> update(@PathVariable Long id, @RequestBody Dto_Medico dto) {
        return ResponseEntity.ok(serviceMedico.update(id, dto));
    }

    @PutMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir o reemplazar foto de perfil del médico")
    public ResponseEntity<Dto_Medico> actualizarFoto(@PathVariable Long id,
            @RequestParam("foto") MultipartFile foto) {
        return ResponseEntity.ok(serviceMedico.actualizarFotoPerfil(id, foto));
    }

    @DeleteMapping("/{id}/foto")
    @Operation(summary = "Eliminar foto de perfil del médico")
    public ResponseEntity<Dto_Medico> eliminarFoto(@PathVariable Long id) {
        return ResponseEntity.ok(serviceMedico.eliminarFotoPerfil(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (soft delete) un médico")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceMedico.delete(id);
        return ResponseEntity.noContent().build();
    }

}
