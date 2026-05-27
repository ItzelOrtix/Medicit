package com.medikitos.medicit.validator;

import com.medikitos.medicit.dto.Dto_Login;

public class Validator_Auth {

    private static final String CORREO_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    private Validator_Auth() {
    }

    public static boolean validarLogin(Dto_Login dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Datos de login obligatorios");
        }
        validarCorreo(dto.getCorreo());
        if (isBlank(dto.getContrasena())) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        return true;
    }

    public static boolean validarCorreo(String correo) {
        if (isBlank(correo) || !correo.trim().matches(CORREO_REGEX)) {
            throw new IllegalArgumentException("El correo no tiene un formato válido");
        }
        return true;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

}
