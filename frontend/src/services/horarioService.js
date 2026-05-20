import api from './api';
import { mockHorarios } from '../data/mockData';

const USE_MOCK = true;

let localMock = [...mockHorarios];

export const horarioService = {
  getAll: async () => {
    if (USE_MOCK) return { data: localMock };
    return api.get('/horario');
  },

  getByMedico: async (medicoId) => {
    if (USE_MOCK) return { data: localMock.filter((h) => h.medicoId === medicoId) };
    return api.get(`/horario/medico/${medicoId}`);
  },

  create: async (horario) => {
    if (USE_MOCK) {
      const nuevo = { ...horario, id: Date.now() };
      localMock = [...localMock, nuevo];
      return { data: nuevo };
    }
    return api.post('/horario', horario);
  },

  toggleDisponibilidad: async (id) => {
    if (USE_MOCK) {
      localMock = localMock.map((h) =>
        h.id === id ? { ...h, disponible: !h.disponible } : h
      );
      return { data: localMock.find((h) => h.id === id) };
    }
    return api.patch(`/horario/${id}/toggle`);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      localMock = localMock.filter((h) => h.id !== id);
      return { data: { message: 'Eliminado' } };
    }
    return api.delete(`/horario/${id}`);
  },
};
