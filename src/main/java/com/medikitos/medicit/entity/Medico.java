package com.medikitos.medicit.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
@ToString
@Table(name = "medico")
@EqualsAndHashCode(callSuper = true)
public class Medico extends Credencial {

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false)
    private String telefono;

    @Column(nullable = false, unique = true)
    private String cedulaProfesional;

    @Column(columnDefinition = "TEXT")
    private String fotoPerfil;

    @ToString.Exclude
    @OneToMany(mappedBy = "medico", fetch = FetchType.LAZY)
    private List<Horario> horarios;

    @ToString.Exclude
    @OneToMany(mappedBy = "medico", fetch = FetchType.LAZY)
    private List<MedicoEspecialidad> especialidades;

    @ToString.Exclude
    @OneToMany(mappedBy = "medico", fetch = FetchType.LAZY)
    private List<Cita> citas;

}
