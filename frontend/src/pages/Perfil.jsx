import { useState } from 'react';

const USER = { name: 'Admin', email: 'admin@medicit.com', role: 'Administrador' };

const NAV_ITEMS = ['Cuenta', 'Seguridad', 'Preferencias'];

export default function Perfil() {
  const [active, setActive] = useState('Cuenta');
  const [name, setName] = useState(USER.name);
  const [email, setEmail] = useState(USER.email);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-xl font-bold select-none">
                  {USER.name[0]}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
                <p className="text-sm text-gray-400 dark:text-white/40 mb-3">{email}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1">
                    Rol: {USER.role}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1">
                    Miembro desde: 2026
                  </span>
                </div>
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
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60 mb-1.5 block">Nombre</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60 mb-1.5 block">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <button
                    onClick={handleSave}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-80 transition-opacity cursor-pointer"
                  >
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
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/5">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Modo oscuro</p>
                  <p className="text-xs text-gray-400 dark:text-white/30">Cambia el tema desde el botón en la barra superior</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Idioma</p>
                  <p className="text-xs text-gray-400 dark:text-white/30">Español (México)</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
