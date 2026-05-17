package com.medikitos.medicit.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@ToString
@Table(name = "especialidad")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ToString.Exclude
    @OneToMany(mappedBy = "especialidad", fetch = FetchType.LAZY)
    private List<MedicoEspecialidad> medicos;

    // ── Getters ──────────────────────────────────────────────────────────────

    public Long getId() { return id; }

    public String getNombre() { return nombre; }

    public String getDescripcion() { return descripcion; }

    public List<MedicoEspecialidad> getMedicos() { return medicos; }

    // ── Setters ──────────────────────────────────────────────────────────────

    public void setId(Long id) { this.id = id; }

    public void setNombre(String nombre) { this.nombre = nombre; }

    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public void setMedicos(List<MedicoEspecialidad> medicos) { this.medicos = medicos; }

}
