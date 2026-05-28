import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, CalendarClock, Plus } from 'lucide-react';
import { mockCitas, mockPacientes, mockMedicos } from '../../data/mockData';

const DAYS_ES   = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];
const DIA_LABEL = { LUNES:'Lunes', MARTES:'Martes', MIERCOLES:'Miércoles', JUEVES:'Jueves', VIERNES:'Viernes', SABADO:'Sábado', DOMINGO:'Domingo' };

const CARD_STYLE = {
  CONFIRMADA: 'bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30',
  PENDIENTE:  'bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30',
  CANCELADA:  'bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30',
  COMPLETADA: 'bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/30',
  FALTÓ:      'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10',
};
const NAME_STYLE = {
  CONFIRMADA: 'text-blue-800 dark:text-blue-300',
  PENDIENTE:  'text-amber-800 dark:text-amber-300',
  CANCELADA:  'text-red-700 dark:text-red-400',
  COMPLETADA: 'text-green-800 dark:text-green-300',
  FALTÓ:      'text-gray-400 dark:text-white/30',
};
const BADGE_STYLE = {
  CONFIRMADA: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  PENDIENTE:  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  CANCELADA:  'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  COMPLETADA: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  FALTÓ:      'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/30',
};
const BADGE_LABEL = {
  CONFIRMADA: 'Confirmada', PENDIENTE: 'Pendiente',
  CANCELADA:  'Cancelada',  COMPLETADA: 'Completada', FALTÓ: 'Faltó',
};

function getMondayOfWeek(offset = 0) {
  const now  = new Date();
  const dow  = now.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekDates(offset) {
  const monday = getMondayOfWeek(offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toISO(date) { return date.toISOString().split('T')[0]; }

function weekLabel(dates) {
  const fmt = (d, opts) => d.toLocaleString('es-MX', opts);
  const first = dates[0], last = dates[6];
  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()}–${last.getDate()} ${fmt(first, { month: 'long' })} ${first.getFullYear()}`;
  }
  return `${first.getDate()} ${fmt(first, { month: 'short' })} – ${last.getDate()} ${fmt(last, { month: 'short' })} ${last.getFullYear()}`;
}

function deriveEstado(estadoNombre, dateISO, todayISO) {
  if (dateISO >= todayISO) return estadoNombre || 'PENDIENTE';
  if (estadoNombre === 'CANCELADA')  return 'CANCELADA';
  if (estadoNombre === 'COMPLETADA') return 'COMPLETADA';
  if (estadoNombre === 'FALTÓ')      return 'FALTÓ';
  if (estadoNombre === 'PENDIENTE')  return 'FALTÓ';
  return 'COMPLETADA';
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const total  = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const inputCls  = 'w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors';
const labelCls  = 'text-xs text-gray-500 dark:text-white/50 mb-1.5 block';

const EMPTY_FORM = { pacienteId: '', fecha: '', horaInicio: '', duracion: '30', motivo: '' };

export default function DoctorHorario() {
  const [weekOffset, setWeekOffset] = useState(0);

  const medicoId  = parseInt(localStorage.getItem('medicit_medico_id'));
  const medico    = mockMedicos.find((m) => m.id === medicoId);
  const STORE_KEY = `medicit_horario_citas_${medicoId}`;

  const [citas, setCitas] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch {}
    return mockCitas.filter((c) => c.medicoId === medicoId);
  });

  const updateCitas = (updater) => {
    setCitas((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const weekDates = getWeekDates(weekOffset);
  const todayISO  = toISO(new Date());
  const cols      = weekDates.length;

  // ── Asistencia ───────────────────────────────────────────────────────────
  const markEstado = (citaId, estadoNombre) => {
    const estadoId = { COMPLETADA: 4, FALTÓ: 5, CANCELADA: 3, CONFIRMADA: 2, PENDIENTE: 1 }[estadoNombre] || 1;
    updateCitas((prev) =>
      prev.map((c) => c.id === citaId ? { ...c, estado: { nombre: estadoNombre }, estadoId } : c)
    );
  };

  // ── Cancelar ─────────────────────────────────────────────────────────────
  const [cancelTarget, setCancelTarget] = useState(null);
  const handleCancel = () => {
    updateCitas((prev) =>
      prev.map((c) => c.id === cancelTarget.id ? { ...c, estadoId: 3, estado: { nombre: 'CANCELADA' } } : c)
    );
    setCancelTarget(null);
  };

  // ── Reprogramar ───────────────────────────────────────────────────────────
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newFecha,         setNewFecha]         = useState('');
  const [newHoraInicio,    setNewHoraInicio]    = useState('');

  const openReschedule = (cita) => {
    setRescheduleTarget(cita);
    setNewFecha(cita.fecha);
    setNewHoraInicio(cita.horaInicio);
  };

  const handleReschedule = () => {
    if (!newFecha || !newHoraInicio) return;
    const [sh, sm] = rescheduleTarget.horaInicio.split(':').map(Number);
    const [eh, em] = rescheduleTarget.horaFin.split(':').map(Number);
    const duracion  = (eh * 60 + em) - (sh * 60 + sm) || 30;
    updateCitas((prev) =>
      prev.map((c) => c.id === rescheduleTarget.id
        ? { ...c, fecha: newFecha, horaInicio: newHoraInicio, horaFin: addMinutes(newHoraInicio, duracion) }
        : c
      )
    );
    setRescheduleTarget(null);
  };

  // ── Nueva cita ────────────────────────────────────────────────────────────
  const [showNew, setShowNew] = useState(false);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [formErr, setFormErr] = useState('');

  const openNew = (fechaPreset = '') => {
    setForm({ ...EMPTY_FORM, fecha: fechaPreset });
    setFormErr('');
    setShowNew(true);
  };

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = () => {
    if (!form.pacienteId || !form.fecha || !form.horaInicio || !form.motivo.trim()) {
      setFormErr('Completa todos los campos obligatorios.');
      return;
    }
    const pac = mockPacientes.find((p) => p.id === parseInt(form.pacienteId));
    const estadoId = { CONFIRMADA: 2, PENDIENTE: 1 }[form.estado] || 1;
    const nueva = {
      id:          Date.now(),
      pacienteId:  pac.id,
      medicoId,
      fecha:       form.fecha,
      horaInicio:  form.horaInicio,
      horaFin:     addMinutes(form.horaInicio, parseInt(form.duracion)),
      estadoId,
      motivo:      form.motivo.trim(),
      notas:       '',
      paciente:    { nombre: pac.nombre, apellido: pac.apellido },
      medico:      { nombre: medico?.nombre, apellido: medico?.apellido, especialidad: medico?.especialidades?.[0]?.nombre },
      estado:      { nombre: form.estado },
    };
    updateCitas((prev) => [...prev, nueva]);
    setShowNew(false);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi horario</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
            {weekOffset === 0 ? 'Esta semana' : weekLabel(weekDates)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openNew()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Plus size={15} />
            Nueva cita
          </button>
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl px-1 py-1 shadow-sm">
            <button onClick={() => setWeekOffset((p) => p - 1)} className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-white/70 px-3 min-w-[200px] text-center">
              {weekLabel(weekDates)}
            </span>
            <button onClick={() => setWeekOffset((p) => p + 1)} className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">

        {/* Cabecera de días */}
        <div className="grid border-b border-gray-100 dark:border-white/10" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {weekDates.map((date) => {
            const dayName = DAYS_ES[date.getDay()];
            const iso     = toISO(date);
            const isToday = iso === todayISO;
            return (
              <div key={iso} className={`px-4 py-3 text-center ${isToday ? 'bg-gray-900 dark:bg-white/10' : 'bg-gray-50 dark:bg-white/5'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${isToday ? 'text-white' : 'text-gray-500 dark:text-white/40'}`}>
                  {DIA_LABEL[dayName]}
                </p>
                <p className={`text-sm font-bold mt-0.5 ${isToday ? 'text-white' : 'text-gray-800 dark:text-white/70'}`}>
                  {date.getDate()}{' '}
                  <span className={`text-xs font-normal ${isToday ? 'text-white/70' : 'text-gray-400 dark:text-white/30'}`}>
                    {date.toLocaleString('es-MX', { month: 'short' })}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Cuerpo */}
        <div className="grid divide-x divide-gray-50 dark:divide-white/5 min-h-[220px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {weekDates.map((date) => {
            const iso      = toISO(date);
            const isFuture = iso >= todayISO;
            const citasDia = citas
              .filter((c) => c.fecha === iso)
              .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

            return (
              <div key={iso} className="p-3 flex flex-col gap-2">
                {citasDia.map((cita) => {
                  const estado  = deriveEstado(cita.estado?.nombre, iso, todayISO);
                  const canEdit         = isFuture && cita.estado?.nombre !== 'CANCELADA';
                  const needsAttendance = !isFuture && ['CONFIRMADA', 'PENDIENTE'].includes(cita.estado?.nombre);
                  const canReEdit       = !isFuture && ['COMPLETADA', 'FALTÓ'].includes(cita.estado?.nombre);
                  return (
                    <div
                      key={cita.id}
                      onDoubleClick={canReEdit ? () => markEstado(cita.id, 'CONFIRMADA') : undefined}
                      title={canReEdit ? 'Doble clic para editar' : undefined}
                      className={`group relative rounded-xl px-2.5 py-2.5 text-xs flex flex-col gap-1 ${canReEdit ? 'cursor-pointer' : ''} ${CARD_STYLE[estado] || CARD_STYLE.PENDIENTE}`}
                    >
                      {canEdit && (
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => openReschedule(cita)}
                            title="Reprogramar"
                            className="w-5 h-5 flex items-center justify-center rounded-md bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-gray-500 dark:text-white/50 transition-colors cursor-pointer"
                          >
                            <CalendarClock size={10} />
                          </button>
                          <button
                            onClick={() => setCancelTarget(cita)}
                            title="Cancelar"
                            className="w-5 h-5 flex items-center justify-center rounded-md bg-white/60 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 dark:text-white/40 transition-colors cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      )}
                      <p className={`font-semibold truncate leading-tight ${canEdit ? 'pr-12' : ''} ${NAME_STYLE[estado] || 'text-gray-700'}`}>
                        {cita.paciente?.nombre} {cita.paciente?.apellido?.[0]}.
                      </p>
                      <p className={`opacity-70 ${NAME_STYLE[estado]}`}>
                        {cita.horaInicio} – {cita.horaFin}
                      </p>
                      <span className={`self-start px-1.5 py-0.5 rounded-md font-medium mt-0.5 ${BADGE_STYLE[estado] || BADGE_STYLE.PENDIENTE}`}>
                        {BADGE_LABEL[estado]}
                      </span>

                      {/* Botones de asistencia para citas pasadas sin resolver */}
                      {needsAttendance && (
                        <div className="flex gap-1 mt-1 pt-1.5 border-t border-black/5 dark:border-white/10">
                          <button
                            onClick={() => markEstado(cita.id, 'COMPLETADA')}
                            className="flex-1 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
                          >
                            ✓ Llegó
                          </button>
                          <button
                            onClick={() => markEstado(cita.id, 'FALTÓ')}
                            className="flex-1 py-1 rounded-md bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            ✗ Faltó
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Agregar cita en este día */}
                {isFuture && (
                  <button
                    onClick={() => openNew(iso)}
                    className="mt-auto flex items-center justify-center gap-1 w-full py-1.5 rounded-lg text-xs text-gray-300 dark:text-white/20 hover:text-gray-500 dark:hover:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Plus size={11} />
                    Agregar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal: cancelar ──────────────────────────────────────────────────── */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setCancelTarget(null)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">¿Cancelar esta cita?</h3>
            <p className="text-sm text-gray-400 dark:text-white/40 mb-4">Esta acción no se puede deshacer.</p>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{cancelTarget.paciente?.nombre} {cancelTarget.paciente?.apellido}</p>
              <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{cancelTarget.fecha} · {cancelTarget.horaInicio} – {cancelTarget.horaFin}</p>
              <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5 italic">{cancelTarget.motivo}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCancelTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">Volver</button>
              <button onClick={handleCancel} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors cursor-pointer">Sí, cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: reprogramar ────────────────────────────────────────────────── */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setRescheduleTarget(null)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Reprogramar cita</h3>
              <button onClick={() => setRescheduleTarget(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"><X size={14} /></button>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{rescheduleTarget.paciente?.nombre} {rescheduleTarget.paciente?.apellido}</p>
              <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5 italic">{rescheduleTarget.motivo}</p>
            </div>
            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className={labelCls}>Nueva fecha</label>
                <input type="date" value={newFecha} min={todayISO} onChange={(e) => setNewFecha(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nueva hora de inicio</label>
                <input type="time" value={newHoraInicio} onChange={(e) => setNewHoraInicio(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRescheduleTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">Cancelar</button>
              <button onClick={handleReschedule} disabled={!newFecha || !newHoraInicio} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white hover:opacity-80 text-white dark:text-gray-900 text-sm font-medium transition-opacity cursor-pointer disabled:opacity-40">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: nueva cita ─────────────────────────────────────────────────── */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Nueva cita</h3>
              <button onClick={() => setShowNew(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"><X size={14} /></button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Paciente */}
              <div>
                <label className={labelCls}>Paciente <span className="text-red-400">*</span></label>
                <select value={form.pacienteId} onChange={setField('pacienteId')} className={inputCls}>
                  <option value="">Seleccionar paciente…</option>
                  {mockPacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                  ))}
                </select>
              </div>

              {/* Fecha + hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Fecha <span className="text-red-400">*</span></label>
                  <input type="date" value={form.fecha} min={todayISO} onChange={setField('fecha')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Hora de inicio <span className="text-red-400">*</span></label>
                  <input type="time" value={form.horaInicio} onChange={setField('horaInicio')} className={inputCls} />
                </div>
              </div>

              {/* Duración */}
              <div>
                <label className={labelCls}>Duración</label>
                <select value={form.duracion} onChange={setField('duracion')} className={inputCls}>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                </select>
              </div>

              {/* Motivo */}
              <div>
                <label className={labelCls}>Motivo <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="Ej. Revisión cardíaca de rutina"
                  value={form.motivo}
                  onChange={setField('motivo')}
                  className={inputCls}
                />
              </div>

              {formErr && <p className="text-xs text-red-500">{formErr}</p>}
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">Cancelar</button>
              <button onClick={handleCreate} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white hover:opacity-80 text-white dark:text-gray-900 text-sm font-medium transition-opacity cursor-pointer">
                Crear cita
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
