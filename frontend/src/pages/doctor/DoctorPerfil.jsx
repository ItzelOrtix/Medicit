import { useState, useEffect } from 'react';
import { medicoService } from '../../services/medicoService';
import { especialidadService } from '../../services/especialidadService';

const NAV_ITEMS = ['Cuenta', 'Especialidad', 'Seguridad'];

function getInitials(nombre, apellido) {
  const n = nombre.replace(/^Dr[a]?\. /, '');
  return `${n[0] || ''}${apellido[0] || ''}`.toUpperCase();
}

export default function DoctorPerfil() {
  const medicoId = parseInt(localStorage.getItem('medicit_medico_id'));

  const [active,        setActive]        = useState('Cuenta');
  const [saved,         setSaved]         = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [especialidades, setEspecialidades] = useState([]);

  const [nombre,   setNombre]   = useState('');
  const [apellido, setApellido] = useState('');
  const [email,    setEmail]    = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula,   setCedula]   = useState('');
  const [espId,    setEspId]    = useState('');

  useEffect(() => {
    medicoService.getById(medicoId).then((res) => {
      const m = res.data;
      setNombre(m.nombre || '');
      setApellido(m.apellido || '');
      setEmail(m.correo || '');
      setTelefono(m.telefono || '');
      setCedula(m.cedulaProfesional || '');
      setEspId(String(m.especialidades?.[0]?.id || ''));
      setLoading(false);
    }).catch(() => setLoading(false));

    especialidadService.getAll()
      .then((res) => setEspecialidades(res.data || []))
      .catch(() => {});
  }, [medicoId]);

  const espNombre = especialidades.find((e) => String(e.id) === espId)?.nombre || '–';

  const handleSave = async () => {
    try {
      if (active === 'Cuenta') {
        await medicoService.update(medicoId, { nombre, apellido, correo: email, telefono, cedulaProfesional: cedula });
      } else if (active === 'Especialidad') {
        await medicoService.update(medicoId, { nombre, apellido, correo: email, telefono, cedulaProfesional: cedula });
        if (espId) {
          await especialidadService.asignarAMedico(parseInt(espId), medicoId);
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  if (loading) return <div className="p-8 text-sm text-gray-400">Cargando...</div>;

  const inputCls = 'w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors';
  const labelCls = 'text-sm text-gray-600 dark:text-white/60 mb-1.5 block';
  const saveBtnCls = 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-80 transition-opacity cursor-pointer';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-sm font-semibold text-gray-900 dark:text-white mb-8 tracking-wide">Perfil</h1>

      <div className="flex gap-8">

        {/* Sidebar de navegación */}
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

          {/* Tarjeta de identidad */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-xl font-bold select-none shrink-0">
                {getInitials(nombre || 'D', apellido || 'r')}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{nombre} {apellido}</h2>
                <p className="text-sm text-gray-400 dark:text-white/40 mb-3">{email}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1">
                    {espNombre}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1">
                    Céd. {cedula}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-300 dark:text-white/20 tracking-widest uppercase shrink-0">
                MediCit
              </p>
            </div>
          </div>

          {/* Cuenta */}
          {active === 'Cuenta' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Información personal</h3>
              <p className="text-sm text-gray-400 dark:text-white/40 mb-6">
                Actualiza tus datos de contacto y la información de tu cuenta.
              </p>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Nombre</label>
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Apellido</label>
                    <input value={apellido} onChange={(e) => setApellido(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Correo electrónico</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <button onClick={handleSave} className={saveBtnCls}>
                    {saved ? 'Guardado ✓' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Especialidad */}
          {active === 'Especialidad' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Datos profesionales</h3>
              <p className="text-sm text-gray-400 dark:text-white/40 mb-6">
                Información de tu cédula profesional y especialidad médica.
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Cédula profesional</label>
                  <input value={cedula} onChange={(e) => setCedula(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Especialidad</label>
                  <select
                    value={espId}
                    onChange={(e) => setEspId(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Sin especialidad</option>
                    {especialidades.map((e) => (
                      <option key={e.id} value={String(e.id)}>{e.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button onClick={handleSave} className={saveBtnCls}>
                    {saved ? 'Guardado ✓' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Seguridad */}
          {active === 'Seguridad' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Seguridad de acceso</h3>
              <p className="text-sm text-gray-400 dark:text-white/40 mb-6">
                Usa una contraseña robusta para mantener tu cuenta protegida.
              </p>
              <div className="flex flex-col gap-4">
                {['Contraseña actual', 'Nueva contraseña', 'Confirmar contraseña'].map((label) => (
                  <div key={label}>
                    <label className={labelCls}>{label}</label>
                    <input type="password" className={inputCls} />
                  </div>
                ))}
                <div>
                  <button className={saveBtnCls}>Actualizar contraseña</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
