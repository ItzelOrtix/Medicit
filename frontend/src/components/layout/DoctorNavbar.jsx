import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { LogOut, ChevronDown, Moon, Sun, UserCircle, Search } from 'lucide-react';
import Logo from '../ui/Logo';
import { useTheme } from '../../hooks/useTheme';
import SearchModal from '../ui/SearchModal';
import { medicoService } from '../../services/medicoService';

export default function DoctorNavbar() {
  const navigate  = useNavigate();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { dark, toggle } = useTheme();

  const medicoId = parseInt(localStorage.getItem('medicit_medico_id'));
  const [medico, setMedico] = useState(null);

  useEffect(() => {
    medicoService.getById(medicoId)
      .then((res) => setMedico(res.data))
      .catch(() => {});
  }, [medicoId]);

  const nombre      = medico?.nombre || '';
  const apellido    = medico?.apellido || '';
  const displayName = medico ? `${nombre} ${apellido}` : 'Médico';
  const initials    = medico ? `${nombre.replace(/^Dr[a]?\. /, '')[0] || 'M'}${apellido[0] || ''}` : 'M';
  const esp         = medico?.especialidades?.[0]?.nombre || 'Médico';

  const handleLogout = () => {
    localStorage.removeItem('medicit_token');
    localStorage.removeItem('medicit_user');
    localStorage.removeItem('medicit_medico_id');
    navigate('/login');
  };

  return (
    <>
    <div className="fixed top-7 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex items-center bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-2xl w-full max-w-4xl">

        {/* Logo */}
        <div className="mr-3 pl-1 cursor-pointer" onClick={() => navigate('/doctor/dashboard')}>
          <Logo theme="dark" size="sm" animateText={false} />
        </div>

        <div className="w-px h-5 bg-white/10 mr-2" />

        {/* Links de navegación */}
        <div className="flex items-center gap-1">
          {[
            { to: '/doctor/horario',          label: 'Citas' },
            { to: '/doctor/horario-laboral',  label: 'Mi horario' },
            { to: '/doctor/pacientes',        label: 'Pacientes' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex-1" />

        {/* Buscar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center justify-center w-8 h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <Search size={15} />
        </button>

        {/* Tema */}
        <button
          onClick={toggle}
          className="flex items-center justify-center w-8 h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Perfil del médico */}
        <div className="flex items-center gap-2 ml-1">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <span className="text-white/80 text-sm font-medium">{nombre || 'Médico'}</span>
              <ChevronDown size={13} className={`text-white/40 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[200px]">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white text-xs font-semibold truncate">{displayName}</p>
                  <p className="text-white/40 text-xs mt-0.5">{medico?.correo}</p>
                  <p className="text-white/30 text-xs mt-0.5">{esp}</p>
                </div>
                <button
                  onClick={() => { navigate('/doctor/perfil'); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <UserCircle size={14} />
                  Mi perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

          <span className="text-xs text-white/30 font-medium px-2.5 py-1 rounded-full border border-white/10 bg-white/5 select-none">
            {esp}
          </span>
        </div>

      </nav>
    </div>

    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
