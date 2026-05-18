package com.medikitos.medicit.validator;

import java.time.LocalDate;

import com.medikitos.medicit.dto.Dto_RegistroPaciente;

public class Validator_Paciente {

    private static final String NOMBRE_REGEX = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,60}$";
    private static final String CORREO_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    private static final String USUARIO_REGEX = "^(?=(?:.*[A-Za-z]){4,})[A-Za-z0-9@$&%]{5,10}$";
    private static final String CONTRASENA_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$";
    private static final String TELEFONO_REGEX = "^\\d{10}$";
    private Validator_Paciente() {
    }

    public static boolean validarRegistro(Dto_RegistroPaciente dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Datos del paciente obligatorios");
        }
        validarNombre(dto.getNombre(), "El nombre no tiene un formato válido");
        validarNombre(dto.getApellido(), "El apellido no tiene un formato válido");
        validarCorreo(dto.getCorreo());
        validarUsuario(dto.getUsuario());
        validarContrasena(dto.getContrasena());
        validarTelefono(dto.getTelefono());
        validarFechaNacimiento(dto.getFechaNacimiento());
        validarGenero(dto.getGenero());
        return true;
    }

    public static boolean validarCorreo(String correo) {
        if (isBlank(correo) || !correo.trim().matches(CORREO_REGEX)) {
            throw new IllegalArgumentException("El correo no tiene un formato válido");
        }
        return true;
    }

    public static boolean validarUsuario(String usuario) {
        if (isBlank(usuario) || !usuario.trim().matches(USUARIO_REGEX)) {
            throw new IllegalArgumentException("El usuario debe tener entre 5 y 10 caracteres, mínimo 4 letras y solo letras, números o @ $ & %");
        }
        return true;
    }

    public static boolean validarContrasena(String contrasena) {
        if (isBlank(contrasena) || !contrasena.matches(CONTRASENA_REGEX)) {
            throw new IllegalArgumentException("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)");
        }
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

    private static boolean validarFechaNacimiento(LocalDate fechaNacimiento) {
        if (fechaNacimiento == null) {
            throw new IllegalArgumentException("La fecha de nacimiento no es válida");
        }
        if (fechaNacimiento.isAfter(LocalDate.now().minusYears(18))) {
            throw new IllegalArgumentException("Debes ser mayor de 18 años");
        }
        if (fechaNacimiento.isBefore(LocalDate.now().minusYears(110))) {
            throw new IllegalArgumentException("La edad no puede ser mayor a 110 años");
        }
        return true;
    }

    private static boolean validarGenero(String genero) {
        if (isBlank(genero)) {
            throw new IllegalArgumentException("El género es obligatorio");
        }
        if (!genero.equalsIgnoreCase("MASCULINO")
                && !genero.equalsIgnoreCase("FEMENINO")
                && !genero.equalsIgnoreCase("OTRO")) {
            throw new IllegalArgumentException("Género inválido");
        }
        return true;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

}
