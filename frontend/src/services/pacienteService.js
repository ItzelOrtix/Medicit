import api from './api';

export const pacienteService = {
  getAll: async () => api.get('/pacientes'),

  getById: async (id) => api.get(`/pacientes/${id}`),

  create: async (paciente) => api.post('/auth/registro/paciente', paciente),

  update: async (id, paciente) => api.put(`/pacientes/${id}`, paciente),

  delete: async (id) => api.delete(`/pacientes/${id}`),
};
