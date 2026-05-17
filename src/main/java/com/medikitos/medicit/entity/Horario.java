package com.medikitos.medicit.entity;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@ToString
@Table(name = "horario")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id", nullable = false)
    private Medico medico;

    @Column(nullable = false)
    private String diaSemana;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    private Boolean disponible;

    private LocalDate fechaEspecifica;

    @Column(nullable = false)
    private Instant createdAt;

    // ── Getters ──────────────────────────────────────────────────────────────

    public Long getId() { return id; }

    public Medico getMedico() { return medico; }

    public String getDiaSemana() { return diaSemana; }

    public LocalTime getHoraInicio() { return horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }

    public Boolean getDisponible() { return disponible; }

    public LocalDate getFechaEspecifica() { return fechaEspecifica; }

    public Instant getCreatedAt() { return createdAt; }

    // ── Setters ──────────────────────────────────────────────────────────────

    public void setId(Long id) { this.id = id; }

    public void setMedico(Medico medico) { this.medico = medico; }

    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public void setFechaEspecifica(LocalDate fechaEspecifica) { this.fechaEspecifica = fechaEspecifica; }

    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

}
