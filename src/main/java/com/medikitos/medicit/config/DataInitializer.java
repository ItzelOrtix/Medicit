package com.medikitos.medicit.config;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.medikitos.medicit.entity.Cita;
import com.medikitos.medicit.entity.Credencial;
import com.medikitos.medicit.entity.Especialidad;
import com.medikitos.medicit.entity.Horario;
import com.medikitos.medicit.entity.Medico;
import com.medikitos.medicit.entity.MedicoEspecialidad;
import com.medikitos.medicit.entity.Paciente;
import com.medikitos.medicit.entity.Role;
import com.medikitos.medicit.repository.Repo_Cita;
import com.medikitos.medicit.repository.Repo_Credencial;
import com.medikitos.medicit.repository.Repo_Especialidad;
import com.medikitos.medicit.repository.Repo_Horario;
import com.medikitos.medicit.repository.Repo_Medico;
import com.medikitos.medicit.repository.Repo_MedicoEspecialidad;
import com.medikitos.medicit.repository.Repo_Paciente;
import com.medikitos.medicit.repository.Repo_Role;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final List<String> ROLES_INICIALES = List.of("PACIENTE", "MEDICO", "ADMINISTRADOR");

    private final Repo_Role repoRole;
    private final Repo_Credencial repoCredencial;
    private final Repo_Especialidad repoEspecialidad;
    private final Repo_Medico repoMedico;
    private final Repo_Paciente repoPaciente;
    private final Repo_MedicoEspecialidad repoMedicoEsp;
    private final Repo_Cita repoCita;
    private final Repo_Horario repoHorario;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.correo}")
    private String adminCorreo;

    @Value("${admin.contrasena}")
    private String adminContrasena;

    public DataInitializer(Repo_Role repoRole, Repo_Credencial repoCredencial,
            Repo_Especialidad repoEspecialidad, Repo_Medico repoMedico,
            Repo_Paciente repoPaciente, Repo_MedicoEspecialidad repoMedicoEsp,
            Repo_Cita repoCita, Repo_Horario repoHorario,
            PasswordEncoder passwordEncoder) {
        this.repoRole = repoRole;
        this.repoCredencial = repoCredencial;
        this.repoEspecialidad = repoEspecialidad;
        this.repoMedico = repoMedico;
        this.repoPaciente = repoPaciente;
        this.repoMedicoEsp = repoMedicoEsp;
        this.repoCita = repoCita;
        this.repoHorario = repoHorario;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        crearRoles();
        crearAdministradorInicial();
        if (repoEspecialidad.count() == 0) {
            List<Especialidad> especialidades = crearEspecialidades();
            List<Medico> medicos = crearMedicos(especialidades);
            List<Paciente> pacientes = crearPacientes();
            crearCitas(medicos, pacientes);
            crearHorarios(medicos);
        }
    }

    private void crearRoles() {
        for (String nombre : ROLES_INICIALES) {
            if (repoRole.findByNombre(nombre) == null) {
                Role role = new Role();
                role.setNombre(nombre);
                repoRole.save(role);
            }
        }
    }

    private void crearAdministradorInicial() {
        if (repoCredencial.existsByCorreo(adminCorreo)) return;
        Role roleAdmin = repoRole.findByNombre("ADMINISTRADOR");
        Credencial admin = new Credencial();
        admin.setCorreo(adminCorreo);
        admin.setContrasena(passwordEncoder.encode(adminContrasena));
        admin.setRol(roleAdmin);
        admin.setCreatedAt(Instant.now());
        repoCredencial.save(admin);
    }

    private List<Especialidad> crearEspecialidades() {
        String[][] datos = {
            { "Cardiología",    "Diagnóstico y tratamiento de enfermedades del corazón." },
            { "Pediatría",      "Atención médica de niños y adolescentes." },
            { "Dermatología",   "Enfermedades de la piel, cabello y uñas." },
            { "Neurología",     "Trastornos del sistema nervioso central y periférico." },
            { "Ortopedia",      "Lesiones y enfermedades del sistema musculoesquelético." },
        };
        return java.util.Arrays.stream(datos).map(d -> {
            Especialidad e = new Especialidad();
            e.setNombre(d[0]);
            e.setDescripcion(d[1]);
            return repoEspecialidad.save(e);
        }).toList();
    }

    private List<Medico> crearMedicos(List<Especialidad> especialidades) {
        Role rolMedico = repoRole.findByNombre("MEDICO");
        String[][] datos = {
            { "Carlos",   "Ramírez",   "medico1@medicit.com", "5551001001", "CED-10001" },
            { "Laura",    "González",  "medico2@medicit.com", "5551002002", "CED-10002" },
            { "Andrés",   "Martínez",  "medico3@medicit.com", "5551003003", "CED-10003" },
            { "Sofía",    "Hernández", "medico4@medicit.com", "5551004004", "CED-10004" },
            { "Miguel",   "Torres",    "medico5@medicit.com", "5551005005", "CED-10005" },
        };
        List<Medico> medicos = new java.util.ArrayList<>();
        for (int i = 0; i < datos.length; i++) {
            String[] d = datos[i];
            Medico m = new Medico();
            m.setNombre(d[0]);
            m.setApellido(d[1]);
            m.setCorreo(d[2]);
            m.setContrasena(passwordEncoder.encode("medico123"));
            m.setRol(rolMedico);
            m.setTelefono(d[3]);
            m.setCedulaProfesional(d[4]);
            m.setCreatedAt(Instant.now());
            Medico saved = repoMedico.save(m);

            MedicoEspecialidad me = new MedicoEspecialidad();
            me.setMedico(saved);
            me.setEspecialidad(especialidades.get(i));
            repoMedicoEsp.save(me);

            medicos.add(saved);
        }
        return medicos;
    }

    private List<Paciente> crearPacientes() {
        Role rolPaciente = repoRole.findByNombre("PACIENTE");
        Object[][] datos = {
            { "Ana",      "López",     "paciente1@medicit.com", "5552001001", LocalDate.of(1990, 3, 15), "Femenino",   "Av. Insurgentes 100" },
            { "Roberto",  "Sánchez",   "paciente2@medicit.com", "5552002002", LocalDate.of(1985, 7, 22), "Masculino",  "Calle Reforma 200" },
            { "Valentina","Cruz",      "paciente3@medicit.com", "5552003003", LocalDate.of(2000, 11, 5), "Femenino",   "Blvd. Juárez 300" },
            { "Javier",   "Morales",   "paciente4@medicit.com", "5552004004", LocalDate.of(1978, 1, 30), "Masculino",  "Calle Hidalgo 400" },
            { "Camila",   "Flores",    "paciente5@medicit.com", "5552005005", LocalDate.of(1995, 6, 18), "Femenino",   "Av. Chapultepec 500" },
        };
        List<Paciente> pacientes = new java.util.ArrayList<>();
        for (Object[] d : datos) {
            Paciente p = new Paciente();
            p.setNombre((String) d[0]);
            p.setApellido((String) d[1]);
            p.setCorreo((String) d[2]);
            p.setContrasena(passwordEncoder.encode("paciente123"));
            p.setRol(rolPaciente);
            p.setTelefono((String) d[3]);
            p.setFechaNacimiento((LocalDate) d[4]);
            p.setGenero((String) d[5]);
            p.setDireccion((String) d[6]);
            p.setCreatedAt(Instant.now());
            pacientes.add(repoPaciente.save(p));
        }
        return pacientes;
    }

    private void crearCitas(List<Medico> medicos, List<Paciente> pacientes) {
        LocalDate hoy = LocalDate.now();
        Object[][] datos = {
            { 0, 0, hoy.plusDays(1),  LocalTime.of(9,  0), LocalTime.of(9,  30), "CONFIRMADA", "Revisión cardíaca de rutina" },
            { 1, 1, hoy.plusDays(2),  LocalTime.of(10, 0), LocalTime.of(10, 30), "PENDIENTE",  "Control de vacunas" },
            { 2, 2, hoy.plusDays(3),  LocalTime.of(11, 0), LocalTime.of(11, 30), "PENDIENTE",  "Revisión de dermatitis" },
            { 3, 3, hoy.minusDays(2), LocalTime.of(9,  0), LocalTime.of(9,  45), "COMPLETADA", "Seguimiento neurológico" },
            { 4, 4, hoy.minusDays(1), LocalTime.of(8,  0), LocalTime.of(8,  30), "CANCELADA",  "Dolor en rodilla derecha" },
        };
        for (Object[] d : datos) {
            Cita c = new Cita();
            c.setMedico(medicos.get((int) d[0]));
            c.setPaciente(pacientes.get((int) d[1]));
            c.setFecha((LocalDate) d[2]);
            c.setHoraInicio((LocalTime) d[3]);
            c.setHoraFin((LocalTime) d[4]);
            c.setEstado((String) d[5]);
            c.setMotivo((String) d[6]);
            c.setCreatedAt(Instant.now());
            repoCita.save(c);
        }
    }

    private void crearHorarios(List<Medico> medicos) {
        Object[][] datos = {
            { 0, DayOfWeek.MONDAY,    LocalTime.of(8,  0), LocalTime.of(14, 0) },
            { 1, DayOfWeek.TUESDAY,   LocalTime.of(9,  0), LocalTime.of(15, 0) },
            { 2, DayOfWeek.WEDNESDAY, LocalTime.of(8,  0), LocalTime.of(13, 0) },
            { 3, DayOfWeek.THURSDAY,  LocalTime.of(10, 0), LocalTime.of(16, 0) },
            { 4, DayOfWeek.FRIDAY,    LocalTime.of(7,  0), LocalTime.of(13, 0) },
        };
        for (Object[] d : datos) {
            Horario h = new Horario();
            h.setMedico(medicos.get((int) d[0]));
            h.setDiaSemana((DayOfWeek) d[1]);
            h.setHoraInicio((LocalTime) d[2]);
            h.setHoraFin((LocalTime) d[3]);
            h.setActivo(true);
            h.setCreatedAt(Instant.now());
            repoHorario.save(h);
        }
    }

}
