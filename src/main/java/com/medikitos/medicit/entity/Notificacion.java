package com.medikitos.medicit.entity;

import java.time.Instant;

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
@Table(name = "notificacion")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cita_id", nullable = false)
    private Cita cita;

    @Column(nullable = false)
    private String tipo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    @Column(nullable = false)
    private String canal;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private Boolean leido;

    private Instant enviadoAt;

    @Column(nullable = false)
    private Instant createdAt;

    // ── Getters ──────────────────────────────────────────────────────────────

    public Long getId() { return id; }

    public Cita getCita() { return cita; }

    public String getTipo() { return tipo; }

    public String getMensaje() { return mensaje; }

    public String getCanal() { return canal; }

    public String getEstado() { return estado; }

    public Boolean getLeido() { return leido; }

    public Instant getEnviadoAt() { return enviadoAt; }

    public Instant getCreatedAt() { return createdAt; }

    // ── Setters ──────────────────────────────────────────────────────────────

    public void setId(Long id) { this.id = id; }

    public void setCita(Cita cita) { this.cita = cita; }

    public void setTipo(String tipo) { this.tipo = tipo; }

    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public void setCanal(String canal) { this.canal = canal; }

    public void setEstado(String estado) { this.estado = estado; }

    public void setLeido(Boolean leido) { this.leido = leido; }

    public void setEnviadoAt(Instant enviadoAt) { this.enviadoAt = enviadoAt; }

    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

}
