import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Stethoscope, CalendarDays, Clock, ArrowRight } from 'lucide-react';

const PAGES = [
  { label: 'Pacientes',  desc: 'Registrar y consultar pacientes', to: '/pacientes', icon: Users },
  { label: 'Médicos',    desc: 'Gestión de médicos y especialidades', to: '/medicos', icon: Stethoscope },
  { label: 'Citas',      desc: 'Agendar, cancelar y reprogramar citas', to: '/citas', icon: CalendarDays },
  { label: 'Horarios',   desc: 'Disponibilidad de médicos por día', to: '/horarios', icon: Clock },
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim()
    ? PAGES.filter((p) =>
        p.label.toLowerCase().includes(query.toLowerCase()) ||
        p.desc.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const go = (to) => { navigate(to); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4 pointer-events-none">
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-xl pointer-events-auto overflow-hidden border border-gray-100 dark:border-white/10"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/10">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca secciones (ej. citas, médicos, pacientes)..."
                  className="flex-1 text-sm text-gray-800 dark:text-white placeholder-gray-300 bg-transparent focus:outline-none"
                />
                <kbd className="text-xs text-gray-300 dark:text-white/20 font-mono bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-200 dark:border-white/10">
                  ESC
                </kbd>
              </div>

              {/* Contenido */}
              <div className="px-2 py-2 min-h-[180px]">
                {query.trim() === '' ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="text-gray-200 dark:text-white/10">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-300 dark:text-white/20 tracking-widest uppercase">
                      Escribe algo para empezar a buscar
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-xs font-semibold text-gray-300 dark:text-white/20 tracking-widest uppercase">
                      Sin resultados para "{query}"
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {results.map(({ label, desc, to, icon: Icon }) => (
                      <button
                        key={to}
                        onClick={() => go(to)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left cursor-pointer group w-full"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                          <Icon size={15} className="text-gray-500 dark:text-white/50" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{label}</p>
                          <p className="text-xs text-gray-400 dark:text-white/30">{desc}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
