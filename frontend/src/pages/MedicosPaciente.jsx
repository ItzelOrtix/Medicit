import { useState, useEffect } from 'react';
import { Search, Phone, Mail, Clock } from 'lucide-react';
import { medicoService } from '../services/medicoService';
import { mockHorarios } from '../data/mockData';

const SPECIALTY_COLORS = {
  'Cardiología':      'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  'Pediatría':        'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  'Dermatología':     'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
  'Neurología':       'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  'Medicina General': 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
};

const DIAS_ES = {
  LUNES: 'Lun', MARTES: 'Mar', MIERCOLES: 'Mié',
  JUEVES: 'Jue', VIERNES: 'Vie', SABADO: 'Sáb', DOMINGO: 'Dom',
};

export default function MedicosPaciente() {
  const [medicos, setMedicos] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    medicoService.getAll().then((r) => setMedicos(r.data));
  }, []);

  const filtered = medicos.filter((m) => {
    const q = search.toLowerCase();
    return (
      `${m.nombre} ${m.apellido}`.toLowerCase().includes(q) ||
      m.especialidades?.some((e) => e.nombre.toLowerCase().includes(q))
    );
  });

  const getHorarios = (medicoId) =>
    mockHorarios.filter((h) => h.medicoId === medicoId && h.disponible);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Médicos disponibles</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
          {medicos.length} especialistas en MediCit
        </p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o especialidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => {
          const especialidad = m.especialidades?.[0]?.nombre || 'General';
          const colorClass = SPECIALTY_COLORS[especialidad] || 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/70';
          const horarios = getHorarios(m.id);

          return (
            <div
              key={m.id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-lg font-bold shrink-0 select-none">
                  {m.nombre[0]}{m.apellido[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {m.nombre} {m.apellido}
                  </p>
                  <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 ${colorClass}`}>
                    {especialidad}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/40">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{m.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/40">
                  <Phone size={12} className="shrink-0" />
                  <span>{m.telefono}</span>
                </div>
              </div>

              {horarios.length > 0 && (
                <div className="pt-3 border-t border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock size={12} className="text-gray-400 dark:text-white/30" />
                    <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      Horarios disponibles
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {horarios.map((h) => (
                      <p key={h.id} className="text-xs text-gray-600 dark:text-white/60">
                        {DIAS_ES[h.diaSemana] || h.diaSemana}: {h.horaInicio}–{h.horaFin}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-14">
            <p className="text-sm text-gray-400 dark:text-white/30">No se encontraron médicos</p>
          </div>
        )}
      </div>
    </div>
  );
}
