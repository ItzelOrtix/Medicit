import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { mockCitas, mockPacientes } from '../../data/mockData';

const ESTADO_STYLE = {
  CONFIRMADA: 'bg-blue-50 text-blue-700',
  PENDIENTE:  'bg-amber-50 text-amber-700',
  CANCELADA:  'bg-red-50 text-red-600',
  COMPLETADA: 'bg-green-50 text-green-700',
};

export default function DoctorPacientes() {
  const medicoId = parseInt(localStorage.getItem('medicit_medico_id'));
  const [search, setSearch] = useState('');

  const misCitas = mockCitas.filter((c) => c.medicoId === medicoId);

  // Agrupar por paciente
  const pacienteIds = [...new Set(misCitas.map((c) => c.pacienteId))];
  const misPacientes = pacienteIds.map((pid) => {
    const dataPaciente = mockPacientes.find((p) => p.id === pid)
                      || misCitas.find((c) => c.pacienteId === pid)?.paciente;
    const citas        = misCitas.filter((c) => c.pacienteId === pid).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const ultimaCita   = citas[0];
    return {
      id:          pid,
      nombre:      dataPaciente?.nombre || '–',
      apellido:    dataPaciente?.apellido || '',
      email:       dataPaciente?.email || '',
      telefono:    dataPaciente?.telefono || '',
      genero:      dataPaciente?.genero || '',
      totalCitas:  citas.length,
      ultimaCita,
      citas,
    };
  });

  const filtered = misPacientes.filter((p) => {
    const q = search.toLowerCase();
    return `${p.nombre} ${p.apellido}`.toLowerCase().includes(q)
        || p.email.toLowerCase().includes(q);
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis pacientes</h1>
        <p className="text-sm text-gray-500 mt-1">
          {misPacientes.length} paciente{misPacientes.length !== 1 ? 's' : ''} atendido{misPacientes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Sin pacientes encontrados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Fila principal */}
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                  {p.nombre[0]}{p.apellido[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{p.nombre} {p.apellido}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
                    {p.genero && <span className="text-xs text-gray-400">· {p.genero}</span>}
                    {p.telefono && <span className="text-xs text-gray-400">· {p.telefono}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-gray-900">{p.totalCitas}</p>
                  <p className="text-xs text-gray-400">cita{p.totalCitas !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Historial de citas */}
              {p.citas.length > 0 && (
                <div className="border-t border-gray-50 divide-y divide-gray-50">
                  {p.citas.slice(0, 3).map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-6 py-2.5">
                      <div className="text-xs text-gray-400 w-24 shrink-0">{c.fecha}</div>
                      <div className="text-xs text-gray-400 w-24 shrink-0">{c.horaInicio} – {c.horaFin}</div>
                      <div className="flex-1 text-xs text-gray-500 truncate">{c.motivo || 'Sin motivo'}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${ESTADO_STYLE[c.estado?.nombre] || 'bg-gray-50 text-gray-500'}`}>
                        {c.estado?.nombre}
                      </span>
                    </div>
                  ))}
                  {p.citas.length > 3 && (
                    <div className="px-6 py-2 text-xs text-gray-400">
                      +{p.citas.length - 3} cita{p.citas.length - 3 !== 1 ? 's' : ''} más
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
