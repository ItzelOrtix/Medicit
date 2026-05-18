package com.medikitos.medicit.dto;

public class Dto_LoginResponse {

    private String token;
    private Long id;
    private String correo;
    private String usuario;
    private String rol;
    private Long expiraEn;

    public Dto_LoginResponse() {
    }

    public Dto_LoginResponse(String token, Long id, String correo, String usuario, String rol, Long expiraEn) {
        this.token = token;
        this.id = id;
        this.correo = correo;
        this.usuario = usuario;
        this.rol = rol;
        this.expiraEn = expiraEn;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Long getExpiraEn() {
        return expiraEn;
    }

    public void setExpiraEn(Long expiraEn) {
        this.expiraEn = expiraEn;
    }

}
