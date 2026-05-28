import api from './api';
import { mockMedicos } from '../data/mockData';

const USE_MOCK = true;

let localMock = [...mockMedicos];

export const medicoService = {
  getAll: async () => {
    if (USE_MOCK) return { data: localMock };
    return api.get('/medico');
  },

  getById: async (id) => {
    if (USE_MOCK) return { data: localMock.find((m) => m.id === id) };
    return api.get(`/medico/${id}`);
  },

  create: async (medico) => {
    if (USE_MOCK) {
      const nuevo = { ...medico, id: Date.now() };
      localMock = [...localMock, nuevo];
      return { data: nuevo };
    }
    return api.post('/medico', medico);
  },

  update: async (id, medico) => {
    if (USE_MOCK) {
      localMock = localMock.map((m) => (m.id === id ? { ...m, ...medico } : m));
      return { data: { ...medico, id } };
    }
    return api.put(`/medico/${id}`, medico);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      localMock = localMock.filter((m) => m.id !== id);
      return { data: { message: 'Eliminado' } };
    }
    return api.delete(`/medico/${id}`);
  },
};
