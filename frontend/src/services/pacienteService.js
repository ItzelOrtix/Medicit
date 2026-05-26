import api from './api';
import { mockPacientes } from '../data/mockData';

const USE_MOCK = true;

let localMock = [...mockPacientes];

export const pacienteService = {
  getAll: async () => {
    if (USE_MOCK) return { data: localMock };
    return api.get('/paciente');
  },

  getById: async (id) => {
    if (USE_MOCK) return { data: localMock.find((p) => p.id === id) };
    return api.get(`/paciente/${id}`);
  },

  create: async (paciente) => {
    if (USE_MOCK) {
      const nuevo = { ...paciente, id: Date.now() };
      localMock = [...localMock, nuevo];
      return { data: nuevo };
    }
    return api.post('/paciente', paciente);
  },

  update: async (id, paciente) => {
    if (USE_MOCK) {
      localMock = localMock.map((p) => (p.id === id ? { ...p, ...paciente } : p));
      return { data: { ...paciente, id } };
    }
    return api.put(`/paciente/${id}`, paciente);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      localMock = localMock.filter((p) => p.id !== id);
      return { data: { message: 'Eliminado' } };
    }
    return api.delete(`/paciente/${id}`);
  },
};
