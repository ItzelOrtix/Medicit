package com.medikitos.medicit.validator;

import com.medikitos.medicit.dto.Dto_RegistroMedico;

public class Validator_Medico {

    private static final String NOMBRE_REGEX = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,60}$";
    private static final String TELEFONO_REGEX = "^\\d{10}$";
    private static final String CEDULA_REGEX = "^[A-Za-z0-9-]{6,20}$";
    private static final String CONTRASENA_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$";

    private Validator_Medico() {
    }

    public static boolean validarRegistro(Dto_RegistroMedico dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Datos del médico obligatorios");
        }
        validarNombre(dto.getNombre(), "El nombre no tiene un formato válido");
        validarNombre(dto.getApellido(), "El apellido no tiene un formato válido");
        Validator_Paciente.validarCorreo(dto.getCorreo());
        validarContrasena(dto.getContrasena());
        validarTelefono(dto.getTelefono());
        validarCedula(dto.getCedulaProfesional());
        return true;
    }

    private static boolean validarNombre(String valor, String mensaje) {
        if (isBlank(valor) || !valor.trim().matches(NOMBRE_REGEX)) {
            throw new IllegalArgumentException(mensaje);
        }
        return true;
    }

    private static boolean validarTelefono(String telefono) {
        if (isBlank(telefono) || !telefono.trim().matches(TELEFONO_REGEX)) {
            throw new IllegalArgumentException("El teléfono debe tener 10 dígitos");
        }
        return true;
    }

    private static boolean validarCedula(String cedula) {
        if (isBlank(cedula) || !cedula.trim().matches(CEDULA_REGEX)) {
            throw new IllegalArgumentException("La cédula profesional no tiene un formato válido");
        }
        return true;
    }

    private static boolean validarContrasena(String contrasena) {
        if (isBlank(contrasena)) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        if (!contrasena.matches(CONTRASENA_REGEX)) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)");
        }
        return true;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

}
