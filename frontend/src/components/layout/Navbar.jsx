import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Search, Moon, Sun, UserCircle, Menu } from 'lucide-react';
import Logo from '../ui/Logo';
import { useTheme } from '../../hooks/useTheme';
import SearchModal from '../ui/SearchModal';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const { dark, toggle } = useTheme();

  const user = getUser();
  const displayName = user.usuario || 'Admin';
  const displayRole = user.rol || 'Administrador';
  const displayEmail = user.correo || '';

  const handleLogout = () => {
    localStorage.removeItem('medicit_token');
    localStorage.removeItem('medicit_user');
    navigate('/login');
  };

  return (
    <>
      {/* on desktop starts after sidebar only when sidebar is visible */}
      <div className={`fixed top-3 left-0 right-0 z-50 px-3 md:px-6 flex justify-center ${showSidebarToggle ? 'md:left-64' : ''}`}>
        <nav className="flex items-center gap-2 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 shadow-2xl w-full max-w-3xl">

          {/* hamburger — only when sidebar is enabled */}
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
            >
              <Menu size={17} />
            </button>
          )}

          {/* logo — links to dashboard */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center cursor-pointer shrink-0"
          >
            <Logo theme="dark" size="sm" animateText={false} />
          </button>

          <div className="flex-1" />

          {/* search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <Search size={15} />
          </button>

          {/* dark mode toggle */}
          <button
            onClick={toggle}
            className="flex items-center justify-center w-8 h-8 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="w-px h-5 bg-white/10" />

          {/* user menu */}
          <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-900 text-xs font-bold shrink-0">
                {displayName[0]?.toUpperCase()}
              </div>
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
