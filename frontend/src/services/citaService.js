import api from './api';
import { mockCitas, mockPacientes, mockMedicos, mockEstadosCita } from '../data/mockData';

const USE_MOCK = true;

let localMock = [...mockCitas];

const enrich = (cita) => ({
  ...cita,
  paciente: mockPacientes.find((p) => p.id === cita.pacienteId) || cita.paciente,
  medico: mockMedicos.find((m) => m.id === cita.medicoId) || cita.medico,
  estado: mockEstadosCita.find((e) => e.id === cita.estadoId) || cita.estado,
});

export const citaService = {
  getAll: async () => {
    if (USE_MOCK) return { data: localMock.map(enrich) };
    return api.get('/cita');
  },

  getById: async (id) => {
    if (USE_MOCK) return { data: enrich(localMock.find((c) => c.id === id)) };
    return api.get(`/cita/${id}`);
  },

  create: async (cita) => {
    if (USE_MOCK) {
      const nueva = { ...cita, id: Date.now() };
      localMock = [...localMock, nueva];
      return { data: enrich(nueva) };
    }
    return api.post('/cita', cita);
  },

  update: async (id, cita) => {
    if (USE_MOCK) {
      localMock = localMock.map((c) => (c.id === id ? { ...c, ...cita } : c));
      return { data: enrich({ ...cita, id }) };
    }
    return api.put(`/cita/${id}`, cita);
  },

  cancelar: async (id) => {
    if (USE_MOCK) {
      localMock = localMock.map((c) => (c.id === id ? { ...c, estadoId: 3 } : c));
      return { data: enrich(localMock.find((c) => c.id === id)) };
    }
    return api.patch(`/cita/${id}/cancelar`);
  },
};
