package com.medikitos.medicit.dto;

import java.time.Instant;

public class Dto_Cita {

    private Long id;
    private Long pacienteId;
    private String pacienteNombre;
    private String pacienteApellido;
    private Long medicoId;
    private String medicoNombre;
    private String medicoApellido;
    private String medicoEspecialidad;
    private String estado;
    private String fecha;
    private String horaInicio;
    private String horaFin;
    private String motivo;
    private String notas;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant deletedAt;

    public Dto_Cita() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getPacienteNombre() { return pacienteNombre; }
    public void setPacienteNombre(String pacienteNombre) { this.pacienteNombre = pacienteNombre; }

    public String getPacienteApellido() { return pacienteApellido; }
    public void setPacienteApellido(String pacienteApellido) { this.pacienteApellido = pacienteApellido; }

    public Long getMedicoId() { return medicoId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }

    public String getMedicoNombre() { return medicoNombre; }
    public void setMedicoNombre(String medicoNombre) { this.medicoNombre = medicoNombre; }

    public String getMedicoApellido() { return medicoApellido; }
    public void setMedicoApellido(String medicoApellido) { this.medicoApellido = medicoApellido; }

    public String getMedicoEspecialidad() { return medicoEspecialidad; }
    public void setMedicoEspecialidad(String medicoEspecialidad) { this.medicoEspecialidad = medicoEspecialidad; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getHoraInicio() { return horaInicio; }
    public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }

    public String getHoraFin() { return horaFin; }
    public void setHoraFin(String horaFin) { this.horaFin = horaFin; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }

}
