const timestamp = () => new Date().toLocaleString('es-MX');

export const notificacionService = {
  confirmarCita: (cita) => {
    const medico = cita.medico
      ? `${cita.medico.nombre} ${cita.medico.apellido}`
      : 'médico asignado';
    const msg = `✅ [${timestamp()}] CITA CONFIRMADA — Motivo: "${cita.motivo}" | Médico: ${medico} | Fecha: ${cita.fecha} ${cita.horaInicio}–${cita.horaFin}`;
    console.log(msg);
    return msg;
  },

  notificarCancelacion: (cita) => {
    const medico = cita.medico
      ? `${cita.medico.nombre} ${cita.medico.apellido}`
      : 'médico asignado';
    const msg = `❌ [${timestamp()}] CITA CANCELADA — Motivo: "${cita.motivo}" | Médico: ${medico} | Fecha programada: ${cita.fecha} ${cita.horaInicio}`;
    console.log(msg);
    return msg;
  },

  notificarCambio: (cita) => {
    const medico = cita.medico
      ? `${cita.medico.nombre} ${cita.medico.apellido}`
      : 'médico asignado';
    const msg = `🔄 [${timestamp()}] CITA REPROGRAMADA — Motivo: "${cita.motivo}" | Médico: ${medico} | Nueva fecha: ${cita.fecha} ${cita.horaInicio}–${cita.horaFin}`;
    console.log(msg);
    return msg;
  },
};
