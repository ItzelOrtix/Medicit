package com.medikitos.medicit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.medikitos.medicit.dto.Dto_Especialidad;
import com.medikitos.medicit.entity.Especialidad;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.MedicoEspecialidad;
import com.medikitos.medicit.mapper.Mapper_Especialidad;
import com.medikitos.medicit.repository.Repo_Especialidad;
import com.medikitos.medicit.repository.Repo_Medico;
import com.medikitos.medicit.repository.Repo_MedicoEspecialidad;
import com.medikitos.medicit.validator.Validator_Especialidad;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class Service_Especialidad {

    private final Repo_Especialidad repoEspecialidad;
    private final Repo_Medico repoMedico;
    private final Repo_MedicoEspecialidad repoMedicoEspecialidad;

    public Service_Especialidad(Repo_Especialidad repoEspecialidad, Repo_Medico repoMedico,
            Repo_MedicoEspecialidad repoMedicoEspecialidad) {
        this.repoEspecialidad = repoEspecialidad;
        this.repoMedico = repoMedico;
        this.repoMedicoEspecialidad = repoMedicoEspecialidad;
    }

    public List<Dto_Especialidad> getAll() {
        return repoEspecialidad.findAll()
                .stream()
                .map(Mapper_Especialidad::toDto)
                .collect(Collectors.toList());
    }

    public Dto_Especialidad create(Dto_Especialidad dto) {
        Validator_Especialidad.validarRegistro(dto);
        if (repoEspecialidad.existsByNombreIgnoreCase(dto.getNombre().trim())) {
            throw new IllegalArgumentException("La especialidad ya está registrada");
        }

        Especialidad especialidad = Mapper_Especialidad.toEntity(dto);
        return Mapper_Especialidad.toDto(repoEspecialidad.save(especialidad));
    }

    public Dto_Especialidad update(Long id, Dto_Especialidad dto) {
        Validator_Especialidad.validarId(id, "Id de especialidad inválido");
        Validator_Especialidad.validarRegistro(dto);
        Especialidad especialidad = obtenerEspecialidad(id);

        if (repoEspecialidad.existsByNombreIgnoreCaseAndIdNot(dto.getNombre().trim(), id)) {
            throw new IllegalArgumentException("La especialidad ya está registrada");
        }

        Mapper_Especialidad.actualizarEntity(especialidad, dto);
        return Mapper_Especialidad.toDto(repoEspecialidad.save(especialidad));
    }

    public void delete(Long id) {
        Validator_Especialidad.validarId(id, "Id de especialidad inválido");
        Especialidad especialidad = obtenerEspecialidad(id);
        if (repoMedicoEspecialidad.existsByEspecialidad_Id(id)) {
            throw new IllegalArgumentException("No se puede eliminar una especialidad asignada a médicos");
        }
        repoEspecialidad.delete(especialidad);
    }

    public Dto_Especialidad asignarAMedico(Long medicoId, Long especialidadId) {
        Validator_Especialidad.validarId(medicoId, "Id de médico inválido");
        Validator_Especialidad.validarId(especialidadId, "Id de especialidad inválido");
        Medico medico = repoMedico.findById(medicoId)
                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado con id: " + medicoId));
        Especialidad especialidad = obtenerEspecialidad(especialidadId);

        if (repoMedicoEspecialidad.existsByMedico_IdAndEspecialidad_Id(medicoId, especialidadId)) {
            throw new IllegalArgumentException("El médico ya tiene asignada esta especialidad");
        }

        MedicoEspecialidad medicoEspecialidad = new MedicoEspecialidad();
        medicoEspecialidad.setMedico(medico);
        medicoEspecialidad.setEspecialidad(especialidad);
        repoMedicoEspecialidad.save(medicoEspecialidad);

        return Mapper_Especialidad.toDto(especialidad);
    }

    private Especialidad obtenerEspecialidad(Long id) {
        return repoEspecialidad.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Especialidad no encontrada con id: " + id));
    }

}
