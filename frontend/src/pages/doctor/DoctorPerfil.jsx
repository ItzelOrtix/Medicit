import { useState, useEffect, useRef } from 'react';
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
  const [foto,          setFoto]          = useState(null);
  const [fotoLoading,   setFotoLoading]   = useState(false);
  const fileInputRef = useRef(null);

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
      setFoto(m.fotoPerfil || null);
      setLoading(false);
    }).catch(() => setLoading(false));

    especialidadService.getAll()
      .then((res) => setEspecialidades(res.data || []))
      .catch(() => {});
  }, [medicoId]);

  const espNombre = especialidades.find((e) => String(e.id) === espId)?.nombre || '–';

  const handleSave = async () => {
    try {
      await medicoService.update(medicoId, { nombre, apellido, correo: email, telefono, cedulaProfesional: cedula });
      if (active === 'Especialidad' && espId) {
        await especialidadService.asignarAMedico(parseInt(espId), medicoId);
      }
      const user = JSON.parse(localStorage.getItem('medicit_user') || '{}');
      localStorage.setItem('medicit_user', JSON.stringify({ ...user, usuario: nombre }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const handleArchivoSeleccionado = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoLoading(true);
    try {
      const res = await medicoService.actualizarFoto(medicoId, file);
      setFoto(res.data.fotoPerfil);
    } catch (err) {
      console.error(err);
    } finally {
      setFotoLoading(false);
      e.target.value = '';
    }
  };

  const handleEliminarFoto = async () => {
    setFotoLoading(true);
    try {
      await medicoService.eliminarFoto(medicoId);
      setFoto(null);
    } catch (err) {
      console.error(err);
    } finally {
      setFotoLoading(false);
    }
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
              <div className="relative shrink-0 group">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleArchivoSeleccionado} />
                {foto ? (
                  <img src={foto} alt="Foto" className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-xl font-bold select-none">
                    {getInitials(nombre || 'D', apellido || 'r')}
                  </div>
                )}
                <button onClick={() => fileInputRef.current?.click()} disabled={fotoLoading}
                  className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  {fotoLoading
                    ? <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    : <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  }
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{nombre} {apellido}</h2>
                <p className="text-sm text-gray-400 dark:text-white/40 mb-3">{email}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1">{espNombre}</span>
                  <span className="text-xs text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 rounded-full px-3 py-1">Céd. {cedula}</span>
                  {foto && (
                    <button onClick={handleEliminarFoto} disabled={fotoLoading}
                      className="text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-400/30 rounded-full px-3 py-1 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors cursor-pointer">
                      Eliminar foto
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-300 dark:text-white/20 tracking-widest uppercase shrink-0">MediCit</p>
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
