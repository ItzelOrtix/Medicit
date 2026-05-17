package com.medikitos.medicit.entity;

import java.time.Instant;
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
@Table(name = "medico")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String telefono;

    @Column(nullable = false, unique = true)
    private String cedulaProfesional;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant updatedAt;

    private Instant deletedAt;

    @ToString.Exclude
    @OneToMany(mappedBy = "medico", fetch = FetchType.LAZY)
    private List<Horario> horarios;

    @ToString.Exclude
    @OneToMany(mappedBy = "medico", fetch = FetchType.LAZY)
    private List<MedicoEspecialidad> especialidades;

    @ToString.Exclude
    @OneToMany(mappedBy = "medico", fetch = FetchType.LAZY)
    private List<Cita> citas;

    // ── Getters ──────────────────────────────────────────────────────────────

    public Long getId() { return id; }

    public String getNombre() { return nombre; }

    public String getApellido() { return apellido; }

    public String getEmail() { return email; }

    public String getTelefono() { return telefono; }

    public String getCedulaProfesional() { return cedulaProfesional; }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }

    public List<Horario> getHorarios() { return horarios; }

    public List<MedicoEspecialidad> getEspecialidades() { return especialidades; }

    public List<Cita> getCitas() { return citas; }

    // ── Setters ──────────────────────────────────────────────────────────────

    public void setId(Long id) { this.id = id; }

    public void setNombre(String nombre) { this.nombre = nombre; }

    public void setApellido(String apellido) { this.apellido = apellido; }

    public void setEmail(String email) { this.email = email; }

    public void setTelefono(String telefono) { this.telefono = telefono; }

    public void setCedulaProfesional(String cedulaProfesional) { this.cedulaProfesional = cedulaProfesional; }

    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }

    public void setHorarios(List<Horario> horarios) { this.horarios = horarios; }

    public void setEspecialidades(List<MedicoEspecialidad> especialidades) { this.especialidades = especialidades; }

    public void setCitas(List<Cita> citas) { this.citas = citas; }

}
