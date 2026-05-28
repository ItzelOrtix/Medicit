import { Users, Stethoscope, CalendarDays, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { to: '/pacientes',      label: 'Pacientes',      desc: 'Registrar y consultar pacientes',        icon: Users },
  { to: '/medicos',        label: 'Médicos',        desc: 'Gestión de médicos y especialidades',     icon: Stethoscope },
  { to: '/especialidades', label: 'Especialidades', desc: 'Administrar especialidades médicas',      icon: BookOpen },
  { to: '/citas',          label: 'Citas',          desc: 'Agendar, cancelar y reprogramar citas',   icon: CalendarDays },
  { to: '/horarios',       label: 'Horarios',       desc: 'Disponibilidad de médicos por día',       icon: Clock },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'Buenos días';
  if (h >= 12 && h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('medicit_user') || '{}');
  } catch {
    return {};
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const nombre = user.usuario || 'Admin';
  const todayShort = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long' }).toUpperCase();

  return (
    <div className="flex flex-col p-4 sm:px-8 sm:pb-8">

      <div className="relative flex flex-col items-center justify-center py-8 sm:py-12 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-transparent to-transparent dark:from-blue-950/40 dark:via-transparent dark:to-transparent pointer-events-none" />
        <h1 className="relative text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white text-center">
          {getGreeting()}, <span className="font-light text-gray-400 dark:text-gray-600">{nombre}.</span>
        </h1>
        <p className="relative text-sm text-gray-400 dark:text-gray-500 mt-4">
          Bienvenido al sistema de gestión de{' '}
          <span className="underline underline-offset-2 text-gray-500 dark:text-gray-400">MediCit</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full mb-6">
        {SECTIONS.map(({ to, label, desc, icon: Icon }) => (
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
