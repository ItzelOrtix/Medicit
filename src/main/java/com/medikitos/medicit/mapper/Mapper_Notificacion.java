package com.medikitos.medicit.mapper;

import java.time.Instant;

import com.medikitos.medicit.dto.Dto_Notificacion;
import com.medikitos.medicit.entity.Cita;
import com.medikitos.medicit.entity.Notificacion;

public class Mapper_Notificacion {

    public static Notificacion toEntity(Dto_Notificacion dto, Cita cita) {

        Notificacion notificacion = new Notificacion();

        notificacion.setCita(cita);
        notificacion.setTipo(dto.getTipo());
        notificacion.setMensaje(dto.getMensaje());
        notificacion.setCanal(dto.getCanal());
        notificacion.setEstado(dto.getEstado());
        notificacion.setLeido(dto.getLeido());
        notificacion.setEnviadoAt(dto.getEnviadoAt());
        notificacion.setCreatedAt(Instant.now());

        return notificacion;
    }

    public static Dto_Notificacion toDto(Notificacion notificacion) {

        return new Dto_Notificacion(
                notificacion.getCita().getId(),
                notificacion.getTipo(),
                notificacion.getMensaje(),
                notificacion.getCanal(),
                notificacion.getEstado(),
                notificacion.getLeido(),
                notificacion.getEnviadoAt(),
                notificacion.getCreatedAt());
    }

}
