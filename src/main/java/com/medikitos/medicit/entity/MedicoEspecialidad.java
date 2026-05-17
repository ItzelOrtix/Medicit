package com.medikitos.medicit.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@ToString
@Table(name = "medico_especialidad")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MedicoEspecialidad {

    @EmbeddedId
    @EqualsAndHashCode.Include
    private MedicoEspecialidadId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("medicoId")
    @JoinColumn(name = "medico_id")
    private Medico medico;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("especialidadId")
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;

    // ── Getters ──────────────────────────────────────────────────────────────

    public MedicoEspecialidadId getId() { return id; }

    public Medico getMedico() { return medico; }

    public Especialidad getEspecialidad() { return especialidad; }

    // ── Setters ──────────────────────────────────────────────────────────────

    public void setId(MedicoEspecialidadId id) { this.id = id; }

    public void setMedico(Medico medico) { this.medico = medico; }

    public void setEspecialidad(Especialidad especialidad) { this.especialidad = especialidad; }

}
