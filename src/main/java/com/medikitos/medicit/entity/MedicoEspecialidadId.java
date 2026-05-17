package com.medikitos.medicit.entity;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Embeddable
@ToString
@EqualsAndHashCode
public class MedicoEspecialidadId implements Serializable {

    private Long medicoId;

    private Long especialidadId;

    // ── Getters ──────────────────────────────────────────────────────────────

    public Long getMedicoId() { return medicoId; }

    public Long getEspecialidadId() { return especialidadId; }

    // ── Setters ──────────────────────────────────────────────────────────────

    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }

    public void setEspecialidadId(Long especialidadId) { this.especialidadId = especialidadId; }

}
