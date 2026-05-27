package com.medikitos.medicit.config;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.medikitos.medicit.entity.Credencial;
import com.medikitos.medicit.entity.Role;
import com.medikitos.medicit.repository.Repo_Credencial;
import com.medikitos.medicit.repository.Repo_Role;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final List<String> ROLES_INICIALES = List.of(
            "PACIENTE",
            "MEDICO",
            "ADMINISTRADOR");

    private final Repo_Role repoRole;
    private final Repo_Credencial repoCredencial;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.correo}")
    private String adminCorreo;

    @Value("${admin.usuario}")
    private String adminUsuario;

    @Value("${admin.contrasena}")
    private String adminContrasena;

    public DataInitializer(Repo_Role repoRole, Repo_Credencial repoCredencial, PasswordEncoder passwordEncoder) {
        this.repoRole = repoRole;
        this.repoCredencial = repoCredencial;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        for (String nombreRol : ROLES_INICIALES) {
            if (repoRole.findByNombre(nombreRol) == null) {
                Role role = new Role();
                role.setNombre(nombreRol);
                repoRole.save(role);
            }
        }
        crearAdministradorInicial();
    }

    private void crearAdministradorInicial() {
        if (repoCredencial.existsByCorreo(adminCorreo)) {
            return;
        }

        Role roleAdmin = repoRole.findByNombre("ADMINISTRADOR");
        Credencial admin = new Credencial();
        admin.setCorreo(adminCorreo);
        admin.setUsuario(adminUsuario);
        admin.setContrasena(passwordEncoder.encode(adminContrasena));
        admin.setRol(roleAdmin);
        admin.setCreatedAt(Instant.now());
        repoCredencial.save(admin);
    }

}
