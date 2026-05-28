import api from './api';

export const horarioService = {
  getAll: async () => api.get('/horarios'),

  getByMedico: async (medicoId) => api.get(`/horarios/medico/${medicoId}`),

  create: async (horario) => api.post('/horarios', horario),

  toggleDisponibilidad: async (id) => api.patch(`/horarios/${id}/toggle`),

  delete: async (id) => api.delete(`/horarios/${id}`),
};
