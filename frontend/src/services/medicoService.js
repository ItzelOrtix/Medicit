import api from './api';

export const medicoService = {
  getAll: async () => api.get('/medicos'),

  getById: async (id) => api.get(`/medicos/${id}`),

  create: async (medico) => {
    const { especialidadId, ...payload } = medico;
    const response = await api.post('/administrador/medicos', payload);
    if (especialidadId && response.data?.id) {
      await api.post(`/administrador/especialidades/asignar-medico/${especialidadId}/${response.data.id}`);
    }
    return response;
  },

  update: async (id, medico) => {
    const { especialidadId, usuario, contrasena, ...payload } = medico;
    return api.put(`/medicos/${id}`, payload);
  },

  delete: async (id) => api.delete(`/medicos/${id}`),

  actualizarFoto: async (id, file) => {
    const formData = new FormData();
    formData.append('foto', file);
    return api.put(`/medicos/${id}/foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  eliminarFoto: async (id) => api.delete(`/medicos/${id}/foto`),
};
