package com.medikitos.medicit.validator;

import com.medikitos.medicit.dto.Dto_Especialidad;

public class Validator_Especialidad {

    private static final String NOMBRE_REGEX = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,80}$";

    private Validator_Especialidad() {
    }

    public static boolean validarRegistro(Dto_Especialidad dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Datos de la especialidad obligatorios");
        }
        validarNombre(dto.getNombre());
        validarDescripcion(dto.getDescripcion());
        return true;
    }

    public static boolean validarId(Long id, String mensaje) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException(mensaje);
        }
        return true;
    }

    private static boolean validarNombre(String nombre) {
        if (isBlank(nombre) || !nombre.trim().matches(NOMBRE_REGEX)) {
            throw new IllegalArgumentException("El nombre de la especialidad debe tener entre 3 y 80 letras");
        }
        return true;
    }

    private static boolean validarDescripcion(String descripcion) {
        if (descripcion != null && descripcion.trim().length() > 500) {
            throw new IllegalArgumentException("La descripción no puede superar los 500 caracteres");
        }
        return true;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

}
