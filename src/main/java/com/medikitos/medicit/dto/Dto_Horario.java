package com.medikitos.medicit.dto;

import java.time.Instant;

public class Dto_Horario {

    private Long id;
    private Long medicoId;
    private String medicoNombre;
    private String medicoApellido;
    private String diaSemana;
    private String horaInicio;
    private String horaFin;
    private Boolean disponible;
    private String fechaEspecifica;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant deletedAt;

    public Dto_Horario() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMedicoId() { return medicoId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }

    public String getMedicoNombre() { return medicoNombre; }
    public void setMedicoNombre(String medicoNombre) { this.medicoNombre = medicoNombre; }

    public String getMedicoApellido() { return medicoApellido; }
    public void setMedicoApellido(String medicoApellido) { this.medicoApellido = medicoApellido; }

    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public String getHoraInicio() { return horaInicio; }
    public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }

    public String getHoraFin() { return horaFin; }
    public void setHoraFin(String horaFin) { this.horaFin = horaFin; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public String getFechaEspecifica() { return fechaEspecifica; }
    public void setFechaEspecifica(String fechaEspecifica) { this.fechaEspecifica = fechaEspecifica; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }

}
