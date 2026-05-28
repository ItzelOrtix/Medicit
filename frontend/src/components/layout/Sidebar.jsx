import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, CalendarDays, Clock, LogOut, BookOpen, X } from 'lucide-react';
import Logo from '../ui/Logo';

const links = [
  { to: '/dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/pacientes',      label: 'Pacientes',      icon: Users },
  { to: '/medicos',        label: 'Médicos',        icon: Stethoscope },
  { to: '/especialidades', label: 'Especialidades', icon: BookOpen },
  { to: '/citas',          label: 'Citas',          icon: CalendarDays },
  { to: '/horarios',       label: 'Horarios',       icon: Clock },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('medicit_token');
    localStorage.removeItem('medicit_user');
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 z-[60]
        bg-gray-950 flex flex-col
        transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="px-5 py-5 border-b border-gray-800 flex items-center justify-between shrink-0">
        <div>
          <Logo theme="dark" size="sm" animateText={false} />
          <p className="text-gray-600 text-xs mt-2">Sistema de citas médicas</p>
        </div>
        <button
          onClick={onClose}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white text-gray-900 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
        <p className="text-gray-700 text-xs mt-3 px-3">v1.0.0 &bull; Clínica MediCit</p>
      </div>
    </aside>
  );
}
