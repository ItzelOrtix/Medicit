package com.medikitos.medicit.dto;

import java.time.Instant;

public class Dto_Notificacion {

    private Long citaId;
    private String tipo;
    private String mensaje;
    private String canal;
    private String estado;
    private Boolean leido;
    private Instant enviadoAt;
    private Instant createdAt;

    public Dto_Notificacion(Long citaId, String tipo, String mensaje, String canal,
            String estado, Boolean leido, Instant enviadoAt, Instant createdAt) {
        this.citaId = citaId;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.canal = canal;
        this.estado = estado;
        this.leido = leido;
        this.enviadoAt = enviadoAt;
        this.createdAt = createdAt;
    }

    public Long getCitaId() {
        return citaId;
    }

    public void setCitaId(Long citaId) {
        this.citaId = citaId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getCanal() {
        return canal;
    }

    public void setCanal(String canal) {
        this.canal = canal;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Boolean getLeido() {
        return leido;
    }

    public void setLeido(Boolean leido) {
        this.leido = leido;
    }

    public Instant getEnviadoAt() {
        return enviadoAt;
    }

    public void setEnviadoAt(Instant enviadoAt) {
        this.enviadoAt = enviadoAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

}
