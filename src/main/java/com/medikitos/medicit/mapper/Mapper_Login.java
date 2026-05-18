package com.medikitos.medicit.mapper;

import com.medikitos.medicit.dto.Dto_LoginResponse;
import com.medikitos.medicit.entity.Credencial;

public class Mapper_Login {

    private Mapper_Login() {
    }

    public static Dto_LoginResponse toDto(Credencial credencial, String token, Long expiraEn) {
        return new Dto_LoginResponse(
                token,
                credencial.getId(),
                credencial.getCorreo(),
                credencial.getUsuario(),
                credencial.getRol().getNombre(),
                expiraEn);
    }

}
