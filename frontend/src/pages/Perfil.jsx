import { useState, useEffect, useRef } from 'react';
import { pacienteService } from '../services/pacienteService';
import { useTheme } from '../hooks/useTheme';

const NAV_ITEMS = ['Cuenta', 'Seguridad', 'Preferencias'];

export default function Perfil() {
  const stored = JSON.parse(localStorage.getItem('medicit_user') || '{}');
  const isPaciente = stored.rol === 'PACIENTE';
  const isAdmin    = stored.rol === 'ADMINISTRADOR';
  const USER = {
    id:   stored.id,
    email: stored.correo || '',
    role: isAdmin ? 'Administrador' : isPaciente ? 'Paciente' : (stored.rol || 'Usuario'),
    isPaciente,
    isAdmin,
  };

  const { dark, toggle } = useTheme();
  const [idioma, setIdioma] = useState(() => localStorage.getItem('medicit_idioma') || 'es');

  const [active,      setActive]      = useState('Cuenta');
  const [nombre,      setNombre]      = useState('');
  const [apellido,    setApellido]    = useState('');
  const [email,       setEmail]       = useState(USER.email);
  const [saved,       setSaved]       = useState(false);
  const [foto,        setFoto]        = useState(null);
  const [fotoLoading, setFotoLoading] = useState(false);
  const [fotoError,   setFotoError]   = useState(null);
  const fileInputRef = useRef(null);

  // Carga datos reales del paciente
  useEffect(() => {
    if (!isPaciente || !USER.id) return;
    pacienteService.getById(USER.id).then((res) => {
      setNombre(res.data.nombre || '');
      setApellido(res.data.apellido || '');
      setEmail(res.data.correo || USER.email);
      setFoto(res.data.fotoPerfil || null);
    }).catch(() => {});
  }, []);

  // Admin: foto desde localStorage
  useEffect(() => {
    if (!isAdmin) return;
    setFoto(localStorage.getItem('medicit_foto_admin') || null);
  }, []);

  const displayName = isPaciente
    ? `${nombre} ${apellido}`.trim() || stored.usuario || 'Usuario'
    : stored.correo || 'Administrador';

  const handleSave = async () => {
    if (isPaciente && USER.id) {
      try {
        await pacienteService.update(USER.id, { nombre, apellido, correo: email });
        const user = JSON.parse(localStorage.getItem('medicit_user') || '{}');
        localStorage.setItem('medicit_user', JSON.stringify({ ...user, usuario: nombre, correo: email }));
      } catch {}
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleIdioma = (e) => {
    setIdioma(e.target.value);
    localStorage.setItem('medicit_idioma', e.target.value);
  };

  const handleSeleccionarFoto = () => {
    fileInputRef.current?.click();
  };

  const handleArchivoSeleccionado = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoLoading(true);
    setFotoError(null);
    try {
      if (isAdmin) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const b64 = ev.target.result;
          localStorage.setItem('medicit_foto_admin', b64);
          setFoto(b64);
          setFotoLoading(false);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
        return;
      }
      const res = await pacienteService.actualizarFoto(USER.id, file);
      setFoto(res.data.fotoPerfil);
    } catch {
      setFotoError('No se pudo subir la foto.');
    } finally {
      setFotoLoading(false);
      e.target.value = '';
    }
  };

  const handleEliminarFoto = async () => {
    setFotoLoading(true);
    setFotoError(null);
    try {
      if (isAdmin) {
        localStorage.removeItem('medicit_foto_admin');
        setFoto(null);
        setFotoLoading(false);
        return;
      }
      await pacienteService.eliminarFoto(USER.id);
      setFoto(null);
    } catch {
      setFotoError('No se pudo eliminar la foto.');
    } finally {
      setFotoLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-sm font-semibold text-gray-900 dark:text-white mb-8 tracking-wide">Perfil</h1>

      <div className="flex gap-8">

        {/* Sidebar */}
        <aside className="w-48 shrink-0">
          <p className="text-xs font-semibold text-gray-400 dark:text-white/30 tracking-widest uppercase mb-4">
            Configuración
          </p>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`text-left text-sm px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  active === item
                    ? 'text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-white/10'
                    : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Tarjeta de usuario */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-5">

              {/* Foto de perfil */}
              <div className="relative shrink-0 group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleArchivoSeleccionado}
                />

                {foto ? (
                  <img src={foto} alt="Foto de perfil" className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-xl font-bold select-none">
                    {displayName[0]?.toUpperCase()}
                  </div>
                )}

                {/* Overlay para subir foto (paciente y admin) */}
                {(isPaciente || isAdmin) && (
                  <button
                    onClick={handleSeleccionarFoto}
                    disabled={fotoLoading}
                    title="Cambiar foto"
                    className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    {fotoLoading ? (
                      <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h2>
                <p className="text-sm text-gray-400 dark:text-white/40 mb-3">{email}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1">
                    Rol: {USER.role}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1">
                    Miembro desde: 2026
                  </span>
                  {(isPaciente || isAdmin) && foto && (
                    <button
                      onClick={handleEliminarFoto}
                      disabled={fotoLoading}
                      className="text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-400/30 rounded-full px-3 py-1 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Eliminar foto
                    </button>
                  )}
                </div>
                {fotoError && (
                  <p className="text-xs text-red-500 mt-2">{fotoError}</p>
                )}
              </div>

              <p className="text-xs text-gray-300 dark:text-white/20 tracking-widest uppercase shrink-0">
                MediCit
              </p>
            </div>
          </div>

          {/* Sección Cuenta */}
          {active === 'Cuenta' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Información de perfil</h3>
              <p className="text-sm text-gray-400 dark:text-white/40 mb-6">
                Actualiza los datos básicos de tu cuenta y la dirección de correo asociada.
              </p>
              <div className="flex flex-col gap-4">
                {isPaciente && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-white/60 mb-1.5 block">Nombre</label>
                        <input value={nombre} onChange={(e) => setNombre(e.target.value)}
                          className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 dark:text-white/60 mb-1.5 block">Apellido</label>
                        <input value={apellido} onChange={(e) => setApellido(e.target.value)}
                          className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors" />
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60 mb-1.5 block">Correo electrónico</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                    className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <button onClick={handleSave}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-80 transition-opacity cursor-pointer">
                    {saved ? 'Guardado ✓' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sección Seguridad */}
          {active === 'Seguridad' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Seguridad de acceso</h3>
              <p className="text-sm text-gray-400 dark:text-white/40 mb-6">
                Usa una contraseña robusta para mantener tu cuenta protegida.
              </p>
              <div className="flex flex-col gap-4">
                {['Contraseña actual', 'Nueva contraseña', 'Confirmar contraseña'].map((label) => (
                  <div key={label}>
                    <label className="text-sm text-gray-600 dark:text-white/60 mb-1.5 block">{label}</label>
                    <input
                      type="password"
                      className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-80 transition-opacity cursor-pointer">
                    Actualizar contraseña
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sección Preferencias */}
          {active === 'Preferencias' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Preferencias</h3>
              <p className="text-sm text-gray-400 dark:text-white/40 mb-6">
                Ajusta el comportamiento visual del sistema.
              </p>

              {/* Modo oscuro */}
              <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Modo oscuro</p>
                  <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                    {dark ? 'Tema oscuro activo' : 'Tema claro activo'}
                  </p>
                </div>
                <button
                  onClick={toggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                    dark ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                      dark
                        ? 'translate-x-6 bg-white dark:bg-gray-900'
                        : 'translate-x-1 bg-white dark:bg-gray-900'
                    }`}
                  />
                </button>
              </div>

              {/* Idioma */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Idioma</p>
                  <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">Idioma de la interfaz</p>
                </div>
                <select
                  value={idioma}
                  onChange={handleIdioma}
                  className="text-sm border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors cursor-pointer"
                >
                  <option value="es">Español (México)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
