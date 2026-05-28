import api from './api';

export const especialidadService = {
  getAll: async () => api.get('/administrador/especialidades/listar'),

  create: async (esp) => api.post('/administrador/especialidades/crear', esp),

  update: async (id, esp) => api.put(`/administrador/especialidades/modificar/${id}`, esp),

  delete: async (id) => api.delete(`/administrador/especialidades/eliminar/${id}`),

  asignarAMedico: async (especialidadId, medicoId) =>
    api.post(`/administrador/especialidades/asignar-medico/${especialidadId}/${medicoId}`),
};
