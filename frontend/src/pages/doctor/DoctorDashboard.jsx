import { useState, useEffect } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { citaService } from '../../services/citaService';
import { medicoService } from '../../services/medicoService';
import { horarioService } from '../../services/horarioService';

const DAYS_ES   = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];
const DAYS_FULL = { LUNES:'Lunes', MARTES:'Martes', MIERCOLES:'Miércoles', JUEVES:'Jueves', VIERNES:'Viernes', SABADO:'Sábado', DOMINGO:'Domingo' };

const ESTADO_STYLE = {
  CONFIRMADA: 'bg-blue-50 text-blue-700 border border-blue-100',
  PENDIENTE:  'bg-amber-50 text-amber-700 border border-amber-100',
  CANCELADA:  'bg-red-50 text-red-600 border border-red-100',
  COMPLETADA: 'bg-green-50 text-green-700 border border-green-100',
};

function greeting() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'Buenos días';
  if (h >= 12 && h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function DoctorDashboard() {
  const medicoId  = parseInt(localStorage.getItem('medicit_medico_id'));
  const today     = new Date().toISOString().split('T')[0];
  const todayDay  = DAYS_ES[new Date().getDay()];

  const [nombre,     setNombre]     = useState('Doctor');
  const [proximas,   setProximas]   = useState([]);
  const [pacUnicos,  setPacUnicos]  = useState(0);
  const [horarioHoy, setHorarioHoy] = useState([]);
  const [citasHoy,   setCitasHoy]   = useState([]);

  useEffect(() => {
    medicoService.getById(medicoId)
      .then((res) => setNombre(res.data?.nombre || 'Doctor'))
      .catch(() => {});

    citaService.getAll().then((res) => {
      const misCitas = res.data.filter((c) => c.medicoId === medicoId);
      const activas  = misCitas.filter((c) => ['PENDIENTE', 'CONFIRMADA'].includes(c.estado?.nombre));
      setProximas([...activas].sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 4));
      setPacUnicos([...new Set(misCitas.map((c) => c.pacienteId))].length);
      setCitasHoy(misCitas.filter((c) => c.fecha === today));
    }).catch(() => {});

    horarioService.getByMedico(medicoId)
      .then((res) => setHorarioHoy((res.data || []).filter((h) => h.diaSemana === todayDay)))
      .catch(() => {});
  }, [medicoId]);

  const todayShort = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long' }).toUpperCase();

  return (
    <div className="flex flex-col px-8 pb-8">

      {/* Saludo */}
      <div className="relative flex flex-col items-center justify-center py-12 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-transparent to-transparent dark:from-blue-950/40 dark:via-transparent dark:to-transparent pointer-events-none" />
        <h1 className="relative text-5xl font-bold text-gray-900 dark:text-white text-center">
          {greeting()},{' '}
          <span className="font-light text-gray-400 dark:text-gray-600">
            {nombre.replace(/^Dr[a]?\. /, 'Dr. ')}
          </span>
        </h1>
        <p className="relative text-sm text-gray-400 dark:text-gray-500 mt-4">
          Bienvenido a tu portal médico en{' '}
          <span className="underline underline-offset-2 text-gray-500 dark:text-gray-400">MediCit</span>.
        </p>

      </div>

      {/* Próximas citas + horario hoy */}
      <div className="grid grid-cols-5 gap-6 max-w-5xl mx-auto w-full">

        {/* Próximas citas */}
        <div className="col-span-3">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">
            Próximas citas activas
          </h2>
          {proximas.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-8 text-center text-gray-400 shadow-sm">
              <CalendarDays size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Sin citas activas</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {proximas.map((cita) => (
                <div key={cita.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 px-5 py-3.5 shadow-sm flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-white/50 shrink-0">
                    {cita.paciente?.nombre?.[0]}{cita.paciente?.apellido?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {cita.paciente?.nombre} {cita.paciente?.apellido}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{cita.motivo || 'Sin motivo'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-white/60">{cita.fecha}</p>
                    <p className="text-xs text-gray-400">{cita.horaInicio}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${ESTADO_STYLE[cita.estado?.nombre] || 'bg-gray-50 text-gray-600'}`}>
                    {cita.estado?.nombre}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Horario hoy */}
        <div className="col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">
            Hoy · {DAYS_FULL[todayDay]}
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-5 shadow-sm">
            {horarioHoy.length === 0 ? (
              <div className="text-center py-6">
                <Clock size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No tienes turno hoy</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {horarioHoy.map((h) => (
                  <div key={h.id} className="flex items-center justify-between px-3 py-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Turno</span>
                    </div>
                    <span className="text-xs text-blue-500 font-medium">{h.horaInicio} – {h.horaFin}</span>
                  </div>
                ))}
                {citasHoy.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/10">
                    <p className="text-xs text-gray-400 font-medium mb-1.5">{citasHoy.length} cita{citasHoy.length !== 1 ? 's' : ''} hoy</p>
                    {citasHoy.map((c) => (
                      <div key={c.id} className="flex items-center justify-between py-1">
                        <span className="text-xs text-gray-600 dark:text-white/60">{c.paciente?.nombre} {c.paciente?.apellido}</span>
                        <span className="text-xs text-gray-400">{c.horaInicio}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-300 dark:text-white/20 tracking-widest uppercase pt-8 pb-2">
        <span>MediCit</span>
        <span>•</span>
        <span>{todayShort}</span>
      </div>
    </div>
  );
}
