import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Stethoscope, UserCircle, Plus } from 'lucide-react';
import { citaService } from '../services/citaService';
import Badge from '../components/ui/Badge';

const ACTIONS = [
  { to: '/nueva-cita', label: 'Agendar cita', desc: 'Reserva una consulta médica', icon: Plus },
  { to: '/mis-citas', label: 'Mis citas', desc: 'Consulta y gestiona tus citas', icon: CalendarDays },
  { to: '/medicos-disponibles', label: 'Médicos', desc: 'Conoce a nuestros especialistas', icon: Stethoscope },
  { to: '/perfil', label: 'Mi perfil', desc: 'Actualiza tu información personal', icon: UserCircle },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'Buenos días';
  if (h >= 12 && h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function DashboardPaciente() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('medicit_user') || '{}');
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    citaService.getAll().then((r) => setCitas(r.data));
  }, []);

  const todayShort = new Date()
    .toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
    .toUpperCase();

  const proxima = citas.filter(
    (c) => c.estado?.nombre === 'PENDIENTE' || c.estado?.nombre === 'CONFIRMADA'
  ).sort(
    (a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio)
  )[0];

  return (
    <div className="flex flex-col px-8 pb-8">

      {/* Saludo */}
      <div className="relative flex flex-col items-center justify-center py-12 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-transparent to-transparent dark:from-blue-950/40 dark:via-transparent dark:to-transparent pointer-events-none" />
        <h1 className="relative text-6xl font-bold text-gray-900 dark:text-white text-center">
          {getGreeting()},{' '}
          <span className="font-light text-gray-400 dark:text-gray-600">
            {user.usuario || 'Paciente'}.
          </span>
        </h1>
        <p className="relative text-sm text-gray-400 dark:text-gray-500 mt-4">
          Bienvenido a tu portal de{' '}
          <span className="underline underline-offset-2 text-gray-500 dark:text-gray-400">MediCit</span>.
        </p>
      </div>

      {/* Próxima cita */}
      {proxima && (
        <div className="max-w-3xl mx-auto w-full mb-6">
          <div className="bg-gray-900 dark:bg-white rounded-2xl p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-gray-900/10 flex items-center justify-center shrink-0">
              <CalendarDays size={22} className="text-white dark:text-gray-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/40 dark:text-gray-400 uppercase tracking-wider mb-1">
                Próxima cita
              </p>
              <p className="text-white dark:text-gray-900 font-semibold truncate">
                {proxima.medico?.nombre} {proxima.medico?.apellido}
              </p>
              <p className="text-white/60 dark:text-gray-500 text-sm">
                {proxima.medico?.especialidad} · {proxima.fecha} · {proxima.horaInicio}
              </p>
            </div>
            <Badge text={proxima.estado?.nombre} />
          </div>
        </div>
      )}

      {/* Cards de acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto w-full mb-6">
        {ACTIONS.map(({ to, label, desc, icon: Icon }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
              <Icon size={20} className="text-gray-600 dark:text-white/60" />
            </div>
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
            <p className="text-sm text-gray-400 dark:text-white/40">{desc}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-300 dark:text-white/20 tracking-widest uppercase pt-2 pb-4">
        <span>MediCit</span>
        <span>•</span>
        <span>{todayShort}</span>
      </div>

    </div>
  );
}
