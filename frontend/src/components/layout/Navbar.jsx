import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Search, Moon, Sun, UserCircle, Menu, Bell, CalendarClock } from 'lucide-react';
import Logo from '../ui/Logo';
import { useTheme } from '../../hooks/useTheme';
import SearchModal from '../ui/SearchModal';
import { pacienteService } from '../../services/pacienteService';
import { citaService } from '../../services/citaService';

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('medicit_user') || '{}');
  } catch {
    return {};
  }
}

export default function Navbar({ onToggleSidebar, showSidebarToggle = true }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [citasProximas, setCitasProximas] = useState([]);
  const bellRef = useRef(null);
  const { dark, toggle } = useTheme();

  const user = getUser();
  const displayName = user.usuario || 'Admin';
  const displayEmail = user.correo || '';
  const displayRole = user.rol === 'ADMINISTRADOR' ? 'Administrador' : user.rol === 'PACIENTE' ? 'Paciente' : (user.rol || 'Administrador');
  const homeRoute = user.rol === 'PACIENTE' ? '/inicio' : '/dashboard';

  const [fotoPerfil, setFotoPerfil] = useState(null);

  useEffect(() => {
    if (user.rol === 'ADMINISTRADOR') {
      setFotoPerfil(localStorage.getItem('medicit_foto_admin') || null);
      return;
    }
    if (user.rol !== 'PACIENTE' || !user.id) return;
    pacienteService.getById(user.id)
      .then((res) => setFotoPerfil(res.data.fotoPerfil || null))
      .catch(() => {});
    citaService.getProximas(user.id)
      .then((res) => setCitasProximas(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!bellOpen) return;
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [bellOpen]);

  const handleLogout = () => {
    localStorage.removeItem('medicit_token');
    localStorage.removeItem('medicit_user');
    localStorage.removeItem('medicit_medico_id');
    navigate('/login');
  };

  return (
    <>
      <div className={`fixed top-3 left-0 right-0 z-50 px-3 md:px-6 flex justify-center ${showSidebarToggle ? 'md:left-64' : ''}`}>
        <nav className="flex items-center gap-2 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 shadow-2xl w-full max-w-3xl">

          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
            >
              <Menu size={17} />
            </button>
          )}

          <button
            onClick={() => navigate(homeRoute)}
            className="flex items-center cursor-pointer shrink-0"
          >
            <Logo theme="dark" size="sm" animateText={false} />
          </button>

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

          {/* Campanita — solo pacientes */}
          {user.rol === 'PACIENTE' && (
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((p) => !p)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <Bell size={15} />
                {citasProximas.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full" />
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-72 z-50">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                    <Bell size={13} className="text-orange-400" />
                    <p className="text-white text-xs font-semibold">Citas próximas</p>
                    {citasProximas.length > 0 && (
                      <span className="ml-auto text-xs bg-orange-400/20 text-orange-300 px-2 py-0.5 rounded-full font-medium">
                        {citasProximas.length}
                      </span>
                    )}
                  </div>

                  {citasProximas.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <CalendarClock size={24} className="text-white/20 mx-auto mb-2" />
                      <p className="text-white/40 text-xs">Sin citas en las próximas 24 horas</p>
                    </div>
                  ) : (
                    <>
                      <ul className="max-h-56 overflow-y-auto divide-y divide-white/5">
                        {citasProximas.map((c) => {
                          const citaDate = new Date(`${c.fecha}T${c.horaInicio}`);
                          const diffH = (citaDate - new Date()) / (1000 * 60 * 60);
                          const diffHLabel = diffH < 1 ? 'menos de 1h' : `${Math.floor(diffH)}h`;
                          const puedeReprogramar = diffH > 12;
                          const hParaRepro = Math.max(0, diffH - 12);
                          return (
                            <li key={c.id} className="px-4 py-3 hover:bg-white/5 transition-colors">
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-xs font-medium truncate">
                                    Dr. {c.medico?.nombre} {c.medico?.apellido}
                                  </p>
                                  <p className="text-white/40 text-xs mt-0.5 truncate">{c.motivo}</p>
                                  <p className="text-white/30 text-xs mt-1">
                                    {c.fecha} · {c.horaInicio}
                                  </p>
                                </div>
                                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                                  diffH <= 1
                                    ? 'bg-red-400/20 text-red-300'
                                    : 'bg-orange-400/20 text-orange-300'
                                }`}>
                                  En {diffHLabel}
                                </span>
                              </div>
                              <p className={`text-xs ${puedeReprogramar ? 'text-blue-300/70' : 'text-red-400/70'}`}>
                                {puedeReprogramar
                                  ? `Puedes reprogramar durante las próximas ${Math.floor(hParaRepro)}h ${Math.floor((hParaRepro % 1) * 60)}min`
                                  : 'Ya no es posible reprogramar (límite de 12h superado)'}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="px-4 py-2.5 border-t border-white/5">
                        <p className="text-white/30 text-xs">
                          Las reprogramaciones solo se aceptan con más de 12 horas de anticipación.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="w-px h-5 bg-white/10" />

          {/* Perfil */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
              >
                {fotoPerfil ? (
                  <img src={fotoPerfil} alt="Foto de perfil" className="w-6 h-6 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-900 text-xs font-bold shrink-0">
                    {displayName[0]?.toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-white/80 text-sm font-medium">{displayName}</span>
                <ChevronDown size={13} className={`text-white/40 transition-transform shrink-0 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[180px]">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-xs font-semibold">{displayName}</p>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{displayEmail}</p>
                    <p className="text-white/30 text-xs mt-0.5">{displayRole}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/perfil'); setMenuOpen(false); }}
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
            <span className="hidden md:block text-xs text-white/30 font-medium px-2.5 py-1 rounded-full border border-white/10 bg-white/5 select-none shrink-0">
              {displayRole}
            </span>
          </div>

        </nav>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
