export const mockPacientes = [
  { id: 1,  nombre: 'Ana',      apellido: 'García López',     email: 'ana.garcia@email.com',      telefono: '555-1234', fechaNacimiento: '1990-03-15', genero: 'Femenino',  direccion: 'Calle Reforma 45, CDMX' },
  { id: 2,  nombre: 'Carlos',   apellido: 'Mendoza Ruiz',     email: 'carlos.mendoza@email.com',  telefono: '555-5678', fechaNacimiento: '1985-07-22', genero: 'Masculino', direccion: 'Av. Insurgentes 200, CDMX' },
  { id: 3,  nombre: 'María',    apellido: 'Torres Vega',      email: 'maria.torres@email.com',    telefono: '555-9012', fechaNacimiento: '1998-11-08', genero: 'Femenino',  direccion: 'Blvd. Juárez 78, Guadalajara' },
  { id: 4,  nombre: 'Roberto',  apellido: 'Flores Jiménez',   email: 'roberto.flores@email.com',  telefono: '555-3456', fechaNacimiento: '1975-01-30', genero: 'Masculino', direccion: 'Calle Hidalgo 12, Monterrey' },
  { id: 5,  nombre: 'Laura',    apellido: 'Ramírez Ortiz',    email: 'laura.ramirez@email.com',   telefono: '555-7890', fechaNacimiento: '2000-05-14', genero: 'Femenino',  direccion: 'Av. Universidad 300, CDMX' },
  { id: 6,  nombre: 'Jorge',    apellido: 'Martínez Peña',    email: 'jorge.martinez@email.com',  telefono: '555-2001', fechaNacimiento: '1988-09-03', genero: 'Masculino', direccion: 'Calle Morelos 15, CDMX' },
  { id: 7,  nombre: 'Daniela',  apellido: 'López Soto',       email: 'daniela.lopez@email.com',   telefono: '555-2002', fechaNacimiento: '1995-02-17', genero: 'Femenino',  direccion: 'Av. Chapultepec 88, CDMX' },
  { id: 8,  nombre: 'Fernando', apellido: 'Cruz Reyes',       email: 'fernando.cruz@email.com',   telefono: '555-2003', fechaNacimiento: '1979-12-25', genero: 'Masculino', direccion: 'Blvd. Ávila Camacho 55, Naucalpan' },
  { id: 9,  nombre: 'Valeria',  apellido: 'Morales Díaz',     email: 'valeria.morales@email.com', telefono: '555-2004', fechaNacimiento: '2002-06-10', genero: 'Femenino',  direccion: 'Calle Juárez 30, Tlalpan' },
  { id: 10, nombre: 'Héctor',   apellido: 'Gutiérrez Luna',   email: 'hector.g@email.com',        telefono: '555-2005', fechaNacimiento: '1970-04-28', genero: 'Masculino', direccion: 'Av. Revolución 120, CDMX' },
  { id: 11, nombre: 'Sofía',    apellido: 'Castillo Vega',    email: 'sofia.castillo@email.com',  telefono: '555-2006', fechaNacimiento: '1993-08-19', genero: 'Femenino',  direccion: 'Calle Allende 22, Coyoacán' },
  { id: 12, nombre: 'Andrés',   apellido: 'Romero García',    email: 'andres.romero@email.com',   telefono: '555-2007', fechaNacimiento: '1987-01-11', genero: 'Masculino', direccion: 'Av. Taxqueña 400, CDMX' },
  { id: 13, nombre: 'Isabela',  apellido: 'Núñez Torres',     email: 'isabela.nunez@email.com',   telefono: '555-2008', fechaNacimiento: '1996-10-05', genero: 'Femenino',  direccion: 'Calle Teotihuacán 7, Ecatepec' },
  { id: 14, nombre: 'Ricardo',  apellido: 'Peña Flores',      email: 'ricardo.pena@email.com',    telefono: '555-2009', fechaNacimiento: '1982-03-22', genero: 'Masculino', direccion: 'Blvd. Manuel Ávila 90, Naucalpan' },
  { id: 15, nombre: 'Camila',   apellido: 'Vega Ruiz',        email: 'camila.vega@email.com',     telefono: '555-2010', fechaNacimiento: '2001-07-14', genero: 'Femenino',  direccion: 'Calle Sonora 33, Condesa' },
];

export const mockEspecialidades = [
  { id: 1, nombre: 'Cardiología',      descripcion: 'Enfermedades del corazón y sistema cardiovascular' },
  { id: 2, nombre: 'Pediatría',        descripcion: 'Atención médica a niños y adolescentes' },
  { id: 3, nombre: 'Dermatología',     descripcion: 'Enfermedades de la piel, cabello y uñas' },
  { id: 4, nombre: 'Neurología',       descripcion: 'Sistema nervioso central y periférico' },
  { id: 5, nombre: 'Medicina General', descripcion: 'Atención médica general y preventiva' },
];

export const mockMedicos = [
  { id: 1, nombre: 'Dr. Eduardo',   apellido: 'Salinas Mora',    email: 'dr.salinas@medicit.com',  telefono: '555-0001', cedulaProfesional: 'CP-12345', especialidades: [{ id: 1, nombre: 'Cardiología' }] },
  { id: 2, nombre: 'Dra. Patricia', apellido: 'Núñez Castro',    email: 'dra.nunez@medicit.com',   telefono: '555-0002', cedulaProfesional: 'CP-23456', especialidades: [{ id: 2, nombre: 'Pediatría' }] },
  { id: 3, nombre: 'Dr. Alejandro', apellido: 'Vargas Pinto',    email: 'dr.vargas@medicit.com',   telefono: '555-0003', cedulaProfesional: 'CP-34567', especialidades: [{ id: 3, nombre: 'Dermatología' }] },
  { id: 4, nombre: 'Dra. Sofía',    apellido: 'Herrera Blanco',  email: 'dra.herrera@medicit.com', telefono: '555-0004', cedulaProfesional: 'CP-45678', especialidades: [{ id: 4, nombre: 'Neurología' }] },
  { id: 5, nombre: 'Dr. Miguel',    apellido: 'Ángel Reyes',     email: 'dr.reyes@medicit.com',    telefono: '555-0005', cedulaProfesional: 'CP-56789', especialidades: [{ id: 5, nombre: 'Medicina General' }] },
];

export const mockHorarios = [
  { id: 1,  medicoId: 1, diaSemana: 'LUNES',     horaInicio: '09:00', horaFin: '13:00', disponible: true },
  { id: 2,  medicoId: 1, diaSemana: 'MIERCOLES', horaInicio: '09:00', horaFin: '13:00', disponible: true },
  { id: 3,  medicoId: 1, diaSemana: 'VIERNES',   horaInicio: '14:00', horaFin: '18:00', disponible: true },
  { id: 4,  medicoId: 2, diaSemana: 'LUNES',     horaInicio: '10:00', horaFin: '14:00', disponible: true },
  { id: 5,  medicoId: 2, diaSemana: 'MARTES',    horaInicio: '10:00', horaFin: '14:00', disponible: true },
  { id: 6,  medicoId: 2, diaSemana: 'JUEVES',    horaInicio: '10:00', horaFin: '14:00', disponible: false },
  { id: 7,  medicoId: 3, diaSemana: 'MARTES',    horaInicio: '08:00', horaFin: '12:00', disponible: true },
  { id: 8,  medicoId: 3, diaSemana: 'JUEVES',    horaInicio: '08:00', horaFin: '12:00', disponible: true },
  { id: 9,  medicoId: 4, diaSemana: 'MIERCOLES', horaInicio: '15:00', horaFin: '19:00', disponible: true },
  { id: 10, medicoId: 4, diaSemana: 'VIERNES',   horaInicio: '09:00', horaFin: '13:00', disponible: true },
  { id: 11, medicoId: 5, diaSemana: 'LUNES',     horaInicio: '08:00', horaFin: '20:00', disponible: true },
  { id: 12, medicoId: 5, diaSemana: 'MARTES',    horaInicio: '08:00', horaFin: '20:00', disponible: true },
  { id: 13, medicoId: 5, diaSemana: 'MIERCOLES', horaInicio: '08:00', horaFin: '20:00', disponible: true },
];

export const mockEstadosCita = [
  { id: 1, nombre: 'PENDIENTE' },
  { id: 2, nombre: 'CONFIRMADA' },
  { id: 3, nombre: 'CANCELADA' },
  { id: 4, nombre: 'COMPLETADA' },
];

// Helper to build a cita object cleanly
function cita(id, pacienteId, medicoId, fecha, horaInicio, horaFin, estadoNombre, motivo, pacienteData, medicoData) {
  const estadoId = { PENDIENTE: 1, CONFIRMADA: 2, CANCELADA: 3, COMPLETADA: 4 }[estadoNombre];
  return { id, pacienteId, medicoId, fecha, horaInicio, horaFin, estadoId, motivo, notas: '',
    paciente: pacienteData, medico: medicoData, estado: { nombre: estadoNombre } };
}

const p = {
  1:  { nombre: 'Ana',      apellido: 'García López' },
  2:  { nombre: 'Carlos',   apellido: 'Mendoza Ruiz' },
  3:  { nombre: 'María',    apellido: 'Torres Vega' },
  4:  { nombre: 'Roberto',  apellido: 'Flores Jiménez' },
  5:  { nombre: 'Laura',    apellido: 'Ramírez Ortiz' },
  6:  { nombre: 'Jorge',    apellido: 'Martínez Peña' },
  7:  { nombre: 'Daniela',  apellido: 'López Soto' },
  8:  { nombre: 'Fernando', apellido: 'Cruz Reyes' },
  9:  { nombre: 'Valeria',  apellido: 'Morales Díaz' },
  10: { nombre: 'Héctor',   apellido: 'Gutiérrez Luna' },
  11: { nombre: 'Sofía',    apellido: 'Castillo Vega' },
  12: { nombre: 'Andrés',   apellido: 'Romero García' },
  13: { nombre: 'Isabela',  apellido: 'Núñez Torres' },
  14: { nombre: 'Ricardo',  apellido: 'Peña Flores' },
  15: { nombre: 'Camila',   apellido: 'Vega Ruiz' },
};

const m = {
  1: { nombre: 'Dr. Eduardo',   apellido: 'Salinas Mora',   especialidad: 'Cardiología' },
  2: { nombre: 'Dra. Patricia', apellido: 'Núñez Castro',   especialidad: 'Pediatría' },
  3: { nombre: 'Dr. Alejandro', apellido: 'Vargas Pinto',   especialidad: 'Dermatología' },
  4: { nombre: 'Dra. Sofía',    apellido: 'Herrera Blanco', especialidad: 'Neurología' },
  5: { nombre: 'Dr. Miguel',    apellido: 'Ángel Reyes',    especialidad: 'Medicina General' },
};

export const mockCitas = [
  // ── Semana pasada (19–25 may) ────────────────────────────────────────────
  cita(1,  1, 1, '2026-05-19', '09:00', '09:30', 'CONFIRMADA', 'Revisión cardíaca de rutina',   p[1],  m[1]),
  cita(2,  5, 1, '2026-05-19', '10:00', '10:30', 'CANCELADA',  'Chequeo post-operatorio',       p[5],  m[1]),
  cita(3,  3, 1, '2026-05-21', '09:00', '09:30', 'CONFIRMADA', 'Electrocardiograma de control', p[3],  m[1]),
  cita(4,  6, 1, '2026-05-21', '10:30', '11:00', 'CONFIRMADA', 'Primera consulta',              p[6],  m[1]),
  cita(5,  2, 1, '2026-05-23', '14:00', '14:30', 'CONFIRMADA', 'Seguimiento de presión alta',   p[2],  m[1]),
  cita(6,  7, 1, '2026-05-23', '15:00', '15:30', 'PENDIENTE',  'Dolor en el pecho',             p[7],  m[1]),
  cita(7,  8, 1, '2026-05-23', '16:00', '16:30', 'CONFIRMADA', 'Revisión de medicación',        p[8],  m[1]),

  // ── Semana actual (26 may – 1 jun) ──────────────────────────────────────
  // Lunes 26 (pasado)
  cita(8,  9, 1, '2026-05-26', '09:00', '09:30', 'CONFIRMADA', 'Ecocardiograma',                p[9],  m[1]),
  cita(9,  10,1, '2026-05-26', '09:30', '10:00', 'CONFIRMADA', 'Consulta de rutina',            p[10], m[1]),
  cita(10, 11,1, '2026-05-26', '10:00', '10:30', 'PENDIENTE',  'Palpitaciones frecuentes',      p[11], m[1]),
  cita(11, 12,1, '2026-05-26', '11:00', '11:30', 'CONFIRMADA', 'Revisión de stent',             p[12], m[1]),

  // Miércoles 28 (hoy)
  cita(12, 1, 1, '2026-05-28', '09:00', '09:30', 'CONFIRMADA', 'Control mensual',               p[1],  m[1]),
  cita(13, 4, 1, '2026-05-28', '09:30', '10:00', 'CONFIRMADA', 'Hipertensión arterial',         p[4],  m[1]),
  cita(14, 13,1, '2026-05-28', '10:00', '10:30', 'PENDIENTE',  'Arritmia leve',                 p[13], m[1]),
  cita(15, 14,1, '2026-05-28', '11:00', '11:30', 'CONFIRMADA', 'Segunda opinión',               p[14], m[1]),
  cita(16, 15,1, '2026-05-28', '12:00', '12:30', 'CANCELADA',  'Revisión anual',                p[15], m[1]),

  // Viernes 30 (futuro)
  cita(17, 2, 1, '2026-05-30', '14:00', '14:30', 'CONFIRMADA', 'Prueba de esfuerzo',            p[2],  m[1]),
  cita(18, 3, 1, '2026-05-30', '14:30', '15:00', 'PENDIENTE',  'Dolor precordial',              p[3],  m[1]),
  cita(19, 5, 1, '2026-05-30', '15:00', '15:30', 'CONFIRMADA', 'Seguimiento valvular',          p[5],  m[1]),
  cita(20, 6, 1, '2026-05-30', '16:00', '16:30', 'CONFIRMADA', 'Consulta por palpitaciones',    p[6],  m[1]),

  // ── Semana siguiente (2–8 jun) ──────────────────────────────────────────
  cita(21, 7, 1, '2026-06-02', '09:00', '09:30', 'CONFIRMADA', 'Chequeo cardíaco completo',     p[7],  m[1]),
  cita(22, 8, 1, '2026-06-02', '10:00', '10:30', 'PENDIENTE',  'Consulta nueva',                p[8],  m[1]),
  cita(23, 9, 1, '2026-06-04', '09:00', '09:30', 'CONFIRMADA', 'Control de arritmia',           p[9],  m[1]),
  cita(24, 10,1, '2026-06-06', '14:00', '14:30', 'PENDIENTE',  'Revisión de marcapasos',        p[10], m[1]),

  // ── Otros médicos ───────────────────────────────────────────────────────
  cita(25, 2, 2, '2026-05-26', '10:00', '10:30', 'CONFIRMADA', 'Control pediátrico mensual',    p[2],  m[2]),
  cita(26, 3, 2, '2026-05-26', '11:00', '11:30', 'PENDIENTE',  'Revisión de vacunas',           p[3],  m[2]),
  cita(27, 1, 2, '2026-05-27', '10:00', '10:30', 'CONFIRMADA', 'Fiebre persistente',            p[1],  m[2]),
  cita(28, 4, 2, '2026-05-29', '10:00', '10:30', 'CONFIRMADA', 'Control de crecimiento',        p[4],  m[2]),
  cita(29, 5, 3, '2026-05-27', '08:00', '08:30', 'CONFIRMADA', 'Eccema en brazo derecho',       p[5],  m[3]),
  cita(30, 6, 3, '2026-05-27', '09:00', '09:30', 'PENDIENTE',  'Alergia cutánea',               p[6],  m[3]),
  cita(31, 7, 3, '2026-05-29', '08:00', '08:30', 'CONFIRMADA', 'Revisión de psoriasis',         p[7],  m[3]),
  cita(32, 8, 4, '2026-05-28', '15:00', '15:30', 'CONFIRMADA', 'Migraña crónica',               p[8],  m[4]),
  cita(33, 9, 4, '2026-05-28', '16:00', '16:30', 'PENDIENTE',  'Cefalea tensional',             p[9],  m[4]),
  cita(34, 10,4, '2026-05-30', '09:00', '09:30', 'CONFIRMADA', 'Epilepsia — control semestral', p[10], m[4]),
  cita(35, 11,5, '2026-05-26', '08:00', '08:30', 'CONFIRMADA', 'Chequeo general',               p[11], m[5]),
  cita(36, 12,5, '2026-05-26', '09:00', '09:30', 'CONFIRMADA', 'Gripe y dolor muscular',        p[12], m[5]),
  cita(37, 13,5, '2026-05-27', '10:00', '10:30', 'PENDIENTE',  'Presión alta',                  p[13], m[5]),
  cita(38, 14,5, '2026-05-28', '08:00', '08:30', 'CONFIRMADA', 'Diabetes tipo 2 — revisión',    p[14], m[5]),
  cita(39, 15,5, '2026-05-29', '11:00', '11:30', 'CONFIRMADA', 'Análisis de sangre',            p[15], m[5]),
];
