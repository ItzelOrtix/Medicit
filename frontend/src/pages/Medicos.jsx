import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Stethoscope, Phone, Mail, Pencil, Trash2, Clock, CalendarDays, ChevronRight } from 'lucide-react';
import { medicoService } from '../services/medicoService';
import { mockEspecialidades, mockHorarios, mockCitas } from '../data/mockData';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Select } from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const empty = { nombre: '', apellido: '', email: '', telefono: '', cedulaProfesional: '', especialidadId: '' };

const SPECIALTY_COLORS = {
  'Cardiología':      { bg: 'bg-red-50',    text: 'text-red-700',    avatar: 'bg-red-100 text-red-700' },
  'Pediatría':        { bg: 'bg-blue-50',   text: 'text-blue-700',   avatar: 'bg-blue-100 text-blue-700' },
  'Dermatología':     { bg: 'bg-orange-50', text: 'text-orange-700', avatar: 'bg-orange-100 text-orange-700' },
  'Neurología':       { bg: 'bg-purple-50', text: 'text-purple-700', avatar: 'bg-purple-100 text-purple-700' },
  'Medicina General': { bg: 'bg-green-50',  text: 'text-green-700',  avatar: 'bg-green-100 text-green-700' },
};
const DEFAULT_COLOR = { bg: 'bg-gray-50', text: 'text-gray-700', avatar: 'bg-gray-100 text-gray-700' };

const DAYS_ABBR  = { LUNES: 'L', MARTES: 'M', MIERCOLES: 'X', JUEVES: 'J', VIERNES: 'V', SABADO: 'S', DOMINGO: 'D' };
const DAYS_FULL  = { LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles', JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo' };
const DAYS_ORDER = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

function getInitials(nombre, apellido) {
  const n = nombre.replace(/^Dr[a]?\. /, '');
  return `${n[0] || ''}${apellido[0] || ''}`.toUpperCase();
}

// ── Formulario de médico ──────────────────────────────────────────────────────

function MedicoForm({ initial = empty, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    nombre: initial.nombre || '',
    apellido: initial.apellido || '',
    email: initial.email || '',
    telefono: initial.telefono || '',
    cedulaProfesional: initial.cedulaProfesional || '',
    especialidadId: initial.especialidades?.[0]?.id || initial.especialidadId || '',
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const esp = mockEspecialidades.find((e) => String(e.id) === String(form.especialidadId));
    onSubmit({ ...form, especialidades: esp ? [{ id: esp.id, nombre: esp.nombre }] : [] });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Nombre *" value={form.nombre} onChange={set('nombre')} required placeholder="Dr. Eduardo" />
        <Input label="Apellido *" value={form.apellido} onChange={set('apellido')} required placeholder="Salinas Mora" />
      </div>
      <Input label="Correo electrónico *" type="email" value={form.email} onChange={set('email')} required placeholder="medico@medicit.com" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Teléfono *" value={form.telefono} onChange={set('telefono')} required placeholder="555-0000" />
        <Input label="Cédula profesional *" value={form.cedulaProfesional} onChange={set('cedulaProfesional')} required placeholder="CP-00000" />
      </div>
      <Select label="Especialidad" value={form.especialidadId} onChange={set('especialidadId')}>
        <option value="">Sin especialidad</option>
        {mockEspecialidades.map((e) => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </Select>
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar médico'}</Button>
      </div>
    </form>
  );
}

// ── Modal de detalle / horarios ───────────────────────────────────────────────

function DetailModal({ medico, onClose }) {
  const horarios  = mockHorarios.filter((h) => h.medicoId === medico.id);
  const citas     = mockCitas.filter((c) => c.medicoId === medico.id);
  const activas   = citas.filter((c) => ['PENDIENTE', 'CONFIRMADA'].includes(c.estado?.nombre));
  const esp       = medico.especialidades?.[0]?.nombre;
  const colors    = SPECIALTY_COLORS[esp] || DEFAULT_COLOR;

  const diasConHorario = DAYS_ORDER.filter((d) => horarios.some((h) => h.diaSemana === d));

  return (
    <div className="flex flex-col gap-5">
      {/* Cabecera del médico */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 ${colors.avatar}`}>
          {getInitials(medico.nombre, medico.apellido)}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">{medico.nombre} {medico.apellido}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Céd. Prof. {medico.cedulaProfesional}</p>
          {esp && (
            <span className={`inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
              {esp}
            </span>
          )}
        </div>
      </div>

      {/* Contacto */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contacto</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={13} className="text-gray-400 shrink-0" />{medico.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={13} className="text-gray-400 shrink-0" />{medico.telefono}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{citas.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Citas totales</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{activas.length}</p>
          <p className="text-xs text-blue-500 mt-0.5">Citas activas</p>
        </div>
      </div>

      {/* Horarios */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Horarios disponibles</p>
        {diasConHorario.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Sin horarios definidos</p>
        ) : (
          <div className="flex flex-col gap-2">
            {diasConHorario.map((dia) =>
              horarios
                .filter((h) => h.diaSemana === dia)
                .map((h) => (
                  <div
                    key={h.id}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${
                      h.disponible
                        ? 'border-green-100 bg-green-50'
                        : 'border-gray-100 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${h.disponible ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-700">{DAYS_FULL[dia]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={11} />
                      {h.horaInicio} – {h.horaFin}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-gray-100 pt-4">
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function Medicos() {
  const [medicos,   setMedicos]   = useState([]);
  const [search,    setSearch]    = useState('');
  const [filterEsp, setFilterEsp] = useState('');
  const [modal,     setModal]     = useState(null); // 'create' | 'edit' | 'detail'
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    const { data } = await medicoService.getAll();
    setMedicos(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = medicos.filter((m) => {
    const q   = search.toLowerCase();
    const esp = m.especialidades?.[0]?.nombre || '';
    return (
      (m.nombre.toLowerCase().includes(q) || m.apellido.toLowerCase().includes(q) || esp.toLowerCase().includes(q)) &&
      (!filterEsp || esp === filterEsp)
    );
  });

  // Pills de filtro por especialidad
  const byEsp = mockEspecialidades
    .map((e) => ({ ...e, count: medicos.filter((m) => m.especialidades?.[0]?.nombre === e.nombre).length }))
    .filter((e) => e.count > 0);

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      await medicoService.create(form);
      await load();
      setModal(null);
      showToast('Médico registrado correctamente');
    } catch {
      showToast('Error al registrar el médico', 'error');
    } finally { setLoading(false); }
  };

  const handleEdit = async (form) => {
    setLoading(true);
    try {
      await medicoService.update(selected.id, form);
      await load();
      setModal(null);
      showToast('Médico actualizado correctamente');
    } catch {
      showToast('Error al actualizar', 'error');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este médico?')) return;
    try {
      await medicoService.delete(id);
      await load();
      showToast('Médico eliminado');
    } catch { showToast('Error al eliminar', 'error'); }
  };

  return (
    <div className="p-8">

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {medicos.length} médico{medicos.length !== 1 ? 's' : ''} registrado{medicos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus size={16} /> Nuevo médico
        </Button>
      </div>

      {/* Filtros por especialidad */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilterEsp('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            !filterEsp ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos ({medicos.length})
        </button>
        {byEsp.map((e) => {
          const c      = SPECIALTY_COLORS[e.nombre] || DEFAULT_COLOR;
          const active = filterEsp === e.nombre;
          return (
            <button
              key={e.id}
              onClick={() => setFilterEsp(active ? '' : e.nombre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                active ? `${c.bg} ${c.text} ring-1 ring-current` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {e.nombre} ({e.count})
            </button>
          );
        })}
      </div>

      {/* Búsqueda */}
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Estado vacío */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Stethoscope size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Sin médicos registrados</p>
        </div>
      )}

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((m) => {
          const esp     = m.especialidades?.[0]?.nombre;
          const colors  = SPECIALTY_COLORS[esp] || DEFAULT_COLOR;
          const horMed  = mockHorarios.filter((h) => h.medicoId === m.id && h.disponible);
          const diasDisp = [...new Set(horMed.map((h) => h.diaSemana))];
          const citasAct = mockCitas.filter(
            (c) => c.medicoId === m.id && ['PENDIENTE', 'CONFIRMADA'].includes(c.estado?.nombre)
          );

          return (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">

              {/* Fila superior: avatar + acciones */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${colors.avatar}`}>
                    {getInitials(m.nombre, m.apellido)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{m.nombre} {m.apellido}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Céd. {m.cedulaProfesional}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => { setSelected(m); setModal('edit'); }}>
                    <Pencil size={13} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}>
                    <Trash2 size={13} className="text-red-400" />
                  </Button>
                </div>
              </div>

              {/* Especialidad */}
              {esp && (
                <span className={`inline-flex self-start px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {esp}
                </span>
              )}

              {/* Días disponibles */}
              {diasDisp.length > 0 ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {DAYS_ORDER.filter((d) => diasDisp.includes(d)).map((dia) => (
                    <span
                      key={dia}
                      title={DAYS_FULL[dia]}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold"
                    >
                      {DAYS_ABBR[dia]}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-300">Sin horarios asignados</p>
              )}

              {/* Contacto + citas activas */}
              <div className="flex flex-col gap-1.5 border-t border-gray-50 pt-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{m.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={12} className="shrink-0" />
                    {m.telefono}
                  </div>
                  {citasAct.length > 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      <CalendarDays size={10} />
                      {citasAct.length} cita{citasAct.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Ver horarios */}
              <button
                onClick={() => { setSelected(m); setModal('detail'); }}
                className="flex items-center justify-center gap-1 w-full py-2 text-xs font-medium text-gray-500 border border-gray-100 rounded-xl hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Ver horarios <ChevronRight size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal: crear */}
      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Registrar nuevo médico">
        <MedicoForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={loading} />
      </Modal>

      {/* Modal: editar */}
      <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Editar médico">
        {selected && (
          <MedicoForm initial={selected} onSubmit={handleEdit} onClose={() => setModal(null)} loading={loading} />
        )}
      </Modal>

      {/* Modal: detalle / horarios */}
      <Modal isOpen={modal === 'detail'} onClose={() => setModal(null)} title="Perfil del médico">
        {selected && <DetailModal medico={selected} onClose={() => setModal(null)} />}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
