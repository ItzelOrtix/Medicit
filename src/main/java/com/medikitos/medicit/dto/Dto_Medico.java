package com.medikitos.medicit.dto;

import java.time.Instant;
import java.util.List;

public class Dto_Medico {

    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String cedulaProfesional;
    private List<Dto_Especialidad> especialidades;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant deletedAt;

    public Dto_Medico(Long id, String nombre, String apellido, String correo, String telefono,
            String cedulaProfesional, Instant createdAt, Instant updatedAt, Instant deletedAt) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.cedulaProfesional = cedulaProfesional;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCedulaProfesional() {
        return cedulaProfesional;
    }

    public void setCedulaProfesional(String cedulaProfesional) {
        this.cedulaProfesional = cedulaProfesional;
    }

    public List<Dto_Especialidad> getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(List<Dto_Especialidad> especialidades) {
        this.especialidades = especialidades;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }

}
