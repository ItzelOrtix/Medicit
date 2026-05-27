import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, CalendarDays, Clock, LogOut } from 'lucide-react';
import Logo from '../ui/Logo';

const links = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/pacientes',  label: 'Pacientes',  icon: Users },
  { to: '/medicos',    label: 'Médicos',    icon: Stethoscope },
  { to: '/citas',      label: 'Citas',      icon: CalendarDays },
  { to: '/horarios',   label: 'Horarios',   icon: Clock },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('medicit_auth');
    navigate('/login');
  };

  return (
    <aside className="w-60 min-h-screen bg-gray-950 flex flex-col shrink-0">
      <div className="px-6 py-6 border-b border-gray-800">
        <Logo theme="dark" size="sm" animateText={false} />
        <p className="text-gray-600 text-xs mt-2.5">Sistema de citas médicas</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
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

      <div className="px-3 py-4 border-t border-gray-800">
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
