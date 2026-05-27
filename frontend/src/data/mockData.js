export const mockPacientes = [
  { id: 1, nombre: 'Ana', apellido: 'García López', email: 'ana.garcia@email.com', telefono: '555-1234', fechaNacimiento: '1990-03-15', genero: 'Femenino', direccion: 'Calle Reforma 45, CDMX' },
  { id: 2, nombre: 'Carlos', apellido: 'Mendoza Ruiz', email: 'carlos.mendoza@email.com', telefono: '555-5678', fechaNacimiento: '1985-07-22', genero: 'Masculino', direccion: 'Av. Insurgentes 200, CDMX' },
  { id: 3, nombre: 'María', apellido: 'Torres Vega', email: 'maria.torres@email.com', telefono: '555-9012', fechaNacimiento: '1998-11-08', genero: 'Femenino', direccion: 'Blvd. Juárez 78, Guadalajara' },
  { id: 4, nombre: 'Roberto', apellido: 'Flores Jiménez', email: 'roberto.flores@email.com', telefono: '555-3456', fechaNacimiento: '1975-01-30', genero: 'Masculino', direccion: 'Calle Hidalgo 12, Monterrey' },
  { id: 5, nombre: 'Laura', apellido: 'Ramírez Ortiz', email: 'laura.ramirez@email.com', telefono: '555-7890', fechaNacimiento: '2000-05-14', genero: 'Femenino', direccion: 'Av. Universidad 300, CDMX' },
];

export const mockEspecialidades = [
  { id: 1, nombre: 'Cardiología', descripcion: 'Enfermedades del corazón y sistema cardiovascular' },
  { id: 2, nombre: 'Pediatría', descripcion: 'Atención médica a niños y adolescentes' },
  { id: 3, nombre: 'Dermatología', descripcion: 'Enfermedades de la piel, cabello y uñas' },
  { id: 4, nombre: 'Neurología', descripcion: 'Sistema nervioso central y periférico' },
  { id: 5, nombre: 'Medicina General', descripcion: 'Atención médica general y preventiva' },
];

export const mockMedicos = [
  { id: 1, nombre: 'Dr. Eduardo', apellido: 'Salinas Mora', email: 'dr.salinas@medicit.com', telefono: '555-0001', cedulaProfesional: 'CP-12345', especialidades: [{ id: 1, nombre: 'Cardiología' }] },
  { id: 2, nombre: 'Dra. Patricia', apellido: 'Núñez Castro', email: 'dra.nunez@medicit.com', telefono: '555-0002', cedulaProfesional: 'CP-23456', especialidades: [{ id: 2, nombre: 'Pediatría' }] },
  { id: 3, nombre: 'Dr. Alejandro', apellido: 'Vargas Pinto', email: 'dr.vargas@medicit.com', telefono: '555-0003', cedulaProfesional: 'CP-34567', especialidades: [{ id: 3, nombre: 'Dermatología' }] },
  { id: 4, nombre: 'Dra. Sofía', apellido: 'Herrera Blanco', email: 'dra.herrera@medicit.com', telefono: '555-0004', cedulaProfesional: 'CP-45678', especialidades: [{ id: 4, nombre: 'Neurología' }] },
  { id: 5, nombre: 'Dr. Miguel', apellido: 'Ángel Reyes', email: 'dr.reyes@medicit.com', telefono: '555-0005', cedulaProfesional: 'CP-56789', especialidades: [{ id: 5, nombre: 'Medicina General' }] },
];

export const mockHorarios = [
  { id: 1, medicoId: 1, diaSemana: 'LUNES', horaInicio: '09:00', horaFin: '13:00', disponible: true },
  { id: 2, medicoId: 1, diaSemana: 'MIERCOLES', horaInicio: '09:00', horaFin: '13:00', disponible: true },
  { id: 3, medicoId: 1, diaSemana: 'VIERNES', horaInicio: '14:00', horaFin: '18:00', disponible: true },
  { id: 4, medicoId: 2, diaSemana: 'LUNES', horaInicio: '10:00', horaFin: '14:00', disponible: true },
  { id: 5, medicoId: 2, diaSemana: 'MARTES', horaInicio: '10:00', horaFin: '14:00', disponible: true },
  { id: 6, medicoId: 2, diaSemana: 'JUEVES', horaInicio: '10:00', horaFin: '14:00', disponible: false },
  { id: 7, medicoId: 3, diaSemana: 'MARTES', horaInicio: '08:00', horaFin: '12:00', disponible: true },
  { id: 8, medicoId: 3, diaSemana: 'JUEVES', horaInicio: '08:00', horaFin: '12:00', disponible: true },
  { id: 9, medicoId: 4, diaSemana: 'MIERCOLES', horaInicio: '15:00', horaFin: '19:00', disponible: true },
  { id: 10, medicoId: 4, diaSemana: 'VIERNES', horaInicio: '09:00', horaFin: '13:00', disponible: true },
  { id: 11, medicoId: 5, diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '20:00', disponible: true },
  { id: 12, medicoId: 5, diaSemana: 'MARTES', horaInicio: '08:00', horaFin: '20:00', disponible: true },
  { id: 13, medicoId: 5, diaSemana: 'MIERCOLES', horaInicio: '08:00', horaFin: '20:00', disponible: true },
];

export const mockEstadosCita = [
  { id: 1, nombre: 'PENDIENTE' },
  { id: 2, nombre: 'CONFIRMADA' },
  { id: 3, nombre: 'CANCELADA' },
  { id: 4, nombre: 'COMPLETADA' },
];

export const mockCitas = [
  { id: 1, pacienteId: 1, medicoId: 1, fecha: '2026-05-20', horaInicio: '09:00', horaFin: '09:30', estadoId: 2, motivo: 'Revisión cardíaca de rutina', notas: 'Paciente con historial de presión alta', paciente: { nombre: 'Ana', apellido: 'García López' }, medico: { nombre: 'Dr. Eduardo', apellido: 'Salinas Mora', especialidad: 'Cardiología' }, estado: { nombre: 'CONFIRMADA' } },
  { id: 2, pacienteId: 2, medicoId: 2, fecha: '2026-05-20', horaInicio: '10:00', horaFin: '10:30', estadoId: 1, motivo: 'Control pediátrico mensual', notas: '', paciente: { nombre: 'Carlos', apellido: 'Mendoza Ruiz' }, medico: { nombre: 'Dra. Patricia', apellido: 'Núñez Castro', especialidad: 'Pediatría' }, estado: { nombre: 'PENDIENTE' } },
  { id: 3, pacienteId: 3, medicoId: 3, fecha: '2026-05-21', horaInicio: '08:00', horaFin: '08:30', estadoId: 2, motivo: 'Consulta por eccema', notas: 'Traer estudios previos', paciente: { nombre: 'María', apellido: 'Torres Vega' }, medico: { nombre: 'Dr. Alejandro', apellido: 'Vargas Pinto', especialidad: 'Dermatología' }, estado: { nombre: 'CONFIRMADA' } },
  { id: 4, pacienteId: 4, medicoId: 5, fecha: '2026-05-19', horaInicio: '11:00', horaFin: '11:30', estadoId: 4, motivo: 'Gripe y fiebre', notas: 'Se recetó reposo y medicamento', paciente: { nombre: 'Roberto', apellido: 'Flores Jiménez' }, medico: { nombre: 'Dr. Miguel', apellido: 'Ángel Reyes', especialidad: 'Medicina General' }, estado: { nombre: 'COMPLETADA' } },
  { id: 5, pacienteId: 5, medicoId: 4, fecha: '2026-05-22', horaInicio: '15:00', horaFin: '15:30', estadoId: 3, motivo: 'Migraña recurrente', notas: 'Paciente canceló por motivos personales', paciente: { nombre: 'Laura', apellido: 'Ramírez Ortiz' }, medico: { nombre: 'Dra. Sofía', apellido: 'Herrera Blanco', especialidad: 'Neurología' }, estado: { nombre: 'CANCELADA' } },
  { id: 6, pacienteId: 1, medicoId: 5, fecha: '2026-05-23', horaInicio: '09:00', horaFin: '09:30', estadoId: 1, motivo: 'Chequeo general anual', notas: '', paciente: { nombre: 'Ana', apellido: 'García López' }, medico: { nombre: 'Dr. Miguel', apellido: 'Ángel Reyes', especialidad: 'Medicina General' }, estado: { nombre: 'PENDIENTE' } },
];
