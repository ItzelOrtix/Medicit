import api from './api';

const enrich = (c) => ({
  ...c,
  paciente: { nombre: c.pacienteNombre, apellido: c.pacienteApellido },
  medico: {
    nombre: c.medicoNombre,
    apellido: c.medicoApellido,
    especialidades: c.medicoEspecialidad ? [{ nombre: c.medicoEspecialidad }] : [],
  },
  estado: { nombre: c.estado },
});

export const citaService = {
  getAll: async () => {
    const res = await api.get('/cita');
    return { data: res.data.map(enrich) };
  },

  getById: async (id) => {
    const res = await api.get(`/cita/${id}`);
    return { data: enrich(res.data) };
  },

  create: async (cita) => {
    const res = await api.post('/cita', cita);
    return { data: enrich(res.data) };
  },

  update: async (id, cita) => {
    const res = await api.put(`/cita/${id}`, cita);
    return { data: enrich(res.data) };
  },

  cancelar: async (id) => {
    const res = await api.patch(`/cita/${id}/cancelar`);
    return { data: enrich(res.data) };
  },

  delete: async (id) => api.delete(`/cita/${id}`),

  getProximas: async (pacienteId) => {
    const res = await api.get('/cita');
    const ahora = new Date();
    const en24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const proximas = res.data
      .filter((c) => {
        if (c.pacienteId !== pacienteId) return false;
        if (c.estado === 'CANCELADA' || c.estado === 'COMPLETADA') return false;
        const citaFecha = new Date(`${c.fecha}T${c.horaInicio}`);
        return citaFecha > ahora && citaFecha <= en24h;
      })
      .map(enrich)
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio));

    return { data: proximas };
  },
};
