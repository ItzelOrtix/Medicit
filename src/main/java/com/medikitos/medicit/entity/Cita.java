package com.medikitos.medicit.entity;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@ToString
@Table(name = "cita")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id", nullable = false)
    private Medico medico;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_id", nullable = false)
    private EstadoCita estado;

    @Column(columnDefinition = "TEXT")
    private String motivo;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant updatedAt;

    private Instant deletedAt;

    @ToString.Exclude
    @OneToMany(mappedBy = "cita", fetch = FetchType.LAZY)
    private List<Notificacion> notificaciones;

    // ── Getters ──────────────────────────────────────────────────────────────

    public Long getId() { return id; }

    public Paciente getPaciente() { return paciente; }

    public Medico getMedico() { return medico; }

    public LocalDate getFecha() { return fecha; }

    public LocalTime getHoraInicio() { return horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }

    public EstadoCita getEstado() { return estado; }

    public String getMotivo() { return motivo; }

    public String getNotas() { return notas; }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }

    public List<Notificacion> getNotificaciones() { return notificaciones; }

    // ── Setters ──────────────────────────────────────────────────────────────

    public void setId(Long id) { this.id = id; }

    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public void setMedico(Medico medico) { this.medico = medico; }

    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public void setEstado(EstadoCita estado) { this.estado = estado; }

    public void setMotivo(String motivo) { this.motivo = motivo; }

    public void setNotas(String notas) { this.notas = notas; }

    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }

    public void setNotificaciones(List<Notificacion> notificaciones) { this.notificaciones = notificaciones; }

}
