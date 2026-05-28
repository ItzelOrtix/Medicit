import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, CalendarClock, Plus, CalendarPlus } from 'lucide-react';
import { citaService } from '../../services/citaService';
import { pacienteService } from '../../services/pacienteService';
import { horarioService } from '../../services/horarioService';

const DAYS_ES   = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];
const DIA_LABEL = { LUNES:'Lunes', MARTES:'Martes', MIERCOLES:'Miércoles', JUEVES:'Jueves', VIERNES:'Viernes', SABADO:'Sábado', DOMINGO:'Domingo' };

// JS getDay() → nombre español
const JS_TO_ES = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function DatePicker({ value, onChange, minDate, diasLaborales }) {
  const init = value ? new Date(value + 'T12:00:00') : new Date();
  const [view, setView] = useState(new Date(init.getFullYear(), init.getMonth(), 1));

  const year  = view.getFullYear();
  const month = view.getMonth();
  const today = new Date().toISOString().split('T')[0];

  const fmt = (d) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const isDisabled = (d) => {
    const iso = fmt(d);
    if (iso < (minDate || today)) return true;
    const dow = new Date(iso + 'T12:00:00').getDay();
    return !diasLaborales.has(JS_TO_ES[dow]);
  };

  // Lunes como primer día (ISO)
  const startDow = new Date(year, month, 1).getDay();
  const blanks   = startDow === 0 ? 6 : startDow - 1;
  const days     = new Date(year, month + 1, 0).getDate();
  const cells    = [...Array(blanks).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-white/10">
        <button type="button" onClick={() => setView(new Date(year, month - 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer text-gray-500 dark:text-white/50">
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs font-semibold text-gray-700 dark:text-white/80">
          {MONTHS_ES[month]} {year}
        </span>
        <button type="button" onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer text-gray-500 dark:text-white/50">
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 px-2 pt-2 pb-1">
        {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 dark:text-white/30 py-1">{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`b${i}`} />;
          const iso      = fmt(d);
          const disabled = isDisabled(d);
          const selected = iso === value;
          const isToday  = iso === today;
          return (
            <button
              key={iso} type="button"
              onClick={() => !disabled && onChange(iso)}
              disabled={disabled}
              className={`mx-auto my-0.5 w-8 h-8 flex items-center justify-center rounded-xl text-xs transition-colors ${
                selected
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold cursor-pointer'
                  : disabled
                    ? 'text-gray-200 dark:text-white/15 cursor-not-allowed'
                    : isToday
                      ? 'text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer'
                      : 'text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
  if (first.getMonth() === last.getMonth())
    return `${first.getDate()}–${last.getDate()} ${fmt(first, { month: 'long' })} ${first.getFullYear()}`;
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

function pad(n) { return String(n).padStart(2, '0'); }

function generarSlots(horarios, fecha, citasExistentes) {
  if (!fecha) return [];
  const dayName = DAYS_ES[new Date(fecha + 'T12:00:00').getDay()];
  const activos = horarios.filter((h) => h.diaSemana === dayName && h.disponible);
  const slots = [];
  for (const h of activos) {
    const [sh, sm] = h.horaInicio.split(':').map(Number);
    const [eh, em] = h.horaFin.split(':').map(Number);
    let cur = sh * 60 + sm;
    const fin = eh * 60 + em;
    while (cur + 60 <= fin) {
      const ini = `${pad(Math.floor(cur / 60))}:${pad(cur % 60)}`;
      const end = `${pad(Math.floor((cur + 60) / 60))}:${pad((cur + 60) % 60)}`;
      const ocupado = citasExistentes.some(
        (c) => c.fecha === fecha && c.horaInicio === ini && c.estado?.nombre !== 'CANCELADA'
      );
      slots.push({ horaInicio: ini, horaFin: end, ocupado });
      cur += 60;
    }
  }
  return slots;
}

const inputCls = 'w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors';
const labelCls = 'text-xs text-gray-500 dark:text-white/50 mb-1.5 block';

const EMPTY_FORM = { pacienteId: '', fecha: '', horaInicio: '', horaFin: '', motivo: '' };

export default function DoctorHorario() {
  const [weekOffset, setWeekOffset] = useState(0);
  const medicoId = parseInt(localStorage.getItem('medicit_medico_id'));

  const [citas,     setCitas]     = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [horarios,  setHorarios]  = useState([]);

  useEffect(() => {
    citaService.getAll()
      .then((res) => setCitas(res.data.filter((c) => c.medicoId === medicoId)))
      .catch(() => {});
    pacienteService.getAll()
      .then((res) => setPacientes(res.data || []))
      .catch(() => {});
    horarioService.getByMedico(medicoId)
      .then((res) => setHorarios(res.data || []))
      .catch(() => {});
  }, [medicoId]);

  const weekDates   = getWeekDates(weekOffset);
  const todayISO    = toISO(new Date());

  // Días en los que el médico tiene horario activo
  const diasLaborales = new Set(horarios.filter((h) => h.disponible).map((h) => h.diaSemana));

  // ── Asistencia ──────────────────────────────────────────────────────────────
  const markEstado = async (citaId, estadoNombre) => {
    const cita = citas.find((c) => c.id === citaId);
    if (!cita) return;
    try {
      const res = await citaService.update(citaId, {
        pacienteId: cita.pacienteId, medicoId: cita.medicoId,
        fecha: cita.fecha, horaInicio: cita.horaInicio, horaFin: cita.horaFin,
        estado: estadoNombre, motivo: cita.motivo, notas: cita.notas,
      });
      setCitas((prev) => prev.map((c) => c.id === citaId ? res.data : c));
    } catch {}
  };

  // ── Cancelar ────────────────────────────────────────────────────────────────
  const [cancelTarget, setCancelTarget] = useState(null);
  const handleCancel = async () => {
    try {
      const res = await citaService.cancelar(cancelTarget.id);
      setCitas((prev) => prev.map((c) => c.id === cancelTarget.id ? res.data : c));
    } catch {}
    setCancelTarget(null);
  };

  // ── Reprogramar ─────────────────────────────────────────────────────────────
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescFecha,        setRescFecha]        = useState('');
  const [rescSlots,        setRescSlots]        = useState([]);
  const [rescSlot,         setRescSlot]         = useState(null);

  const openReschedule = (cita) => {
    setRescheduleTarget(cita);
    setRescFecha('');
    setRescSlots([]);
    setRescSlot(null);
  };

  const onRescFechaChange = (fecha) => {
    setRescFecha(fecha);
    setRescSlot(null);
    const citasSinEsta = citas.filter((c) => c.id !== rescheduleTarget?.id);
    setRescSlots(generarSlots(horarios, fecha, citasSinEsta));
  };

  const handleReschedule = async () => {
    if (!rescFecha || !rescSlot) return;
    try {
      const res = await citaService.update(rescheduleTarget.id, {
        pacienteId: rescheduleTarget.pacienteId, medicoId: rescheduleTarget.medicoId,
        fecha: rescFecha, horaInicio: rescSlot.horaInicio, horaFin: rescSlot.horaFin,
        estado: 'PENDIENTE', motivo: rescheduleTarget.motivo, notas: rescheduleTarget.notas,
      });
      setCitas((prev) => prev.map((c) => c.id === rescheduleTarget.id ? res.data : c));
    } catch {}
    setRescheduleTarget(null);
  };

  // ── Nueva cita ──────────────────────────────────────────────────────────────
  const [showNew, setShowNew] = useState(false);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [slots,   setSlots]   = useState([]);
  const [formErr, setFormErr] = useState('');

  const openNew = (fechaPreset = '', pacientePreset = '') => {
    const newForm = { ...EMPTY_FORM, fecha: fechaPreset, pacienteId: pacientePreset };
    setForm(newForm);
    setFormErr('');
    setSlots(fechaPreset ? generarSlots(horarios, fechaPreset, citas) : []);
    setShowNew(true);
  };

  const onFechaChange = (e) => {
    const fecha = e.target.value;
    setForm((f) => ({ ...f, fecha, horaInicio: '', horaFin: '' }));
    setSlots(generarSlots(horarios, fecha, citas));
  };

  const selectSlot = (slot) => {
    if (slot.ocupado) return;
    setForm((f) => ({ ...f, horaInicio: slot.horaInicio, horaFin: slot.horaFin }));
  };

  const handleCreate = async () => {
    if (!form.pacienteId || !form.fecha || !form.horaInicio || !form.motivo.trim()) {
      setFormErr('Completa todos los campos obligatorios.');
      return;
    }
    try {
      const res = await citaService.create({
        pacienteId: parseInt(form.pacienteId), medicoId,
        fecha: form.fecha, horaInicio: form.horaInicio, horaFin: form.horaFin,
        estado: 'PENDIENTE', motivo: form.motivo.trim(),
      });
      setCitas((prev) => [...prev, res.data]);
      setShowNew(false);
    } catch (err) {
      setFormErr(err?.response?.data || 'El horario seleccionado no está disponible.');
    }
  };

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis citas</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
            {weekOffset === 0 ? 'Esta semana' : weekLabel(weekDates)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openNew()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Plus size={15} /> Nueva cita
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

        {/* Cabecera */}
        <div className="grid border-b border-gray-100 dark:border-white/10" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
          {weekDates.map((date) => {
            const dayName  = DAYS_ES[date.getDay()];
            const iso      = toISO(date);
            const isToday  = iso === todayISO;
            const labora   = diasLaborales.has(dayName);
            return (
              <div key={iso} className={`px-4 py-3 text-center ${isToday ? 'bg-gray-900 dark:bg-white/10' : labora ? 'bg-gray-50 dark:bg-white/5' : 'bg-white dark:bg-gray-950'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${isToday ? 'text-white' : labora ? 'text-gray-500 dark:text-white/40' : 'text-gray-300 dark:text-white/20'}`}>
                  {DIA_LABEL[dayName]}
                </p>
                <p className={`text-sm font-bold mt-0.5 ${isToday ? 'text-white' : labora ? 'text-gray-800 dark:text-white/70' : 'text-gray-300 dark:text-white/20'}`}>
                  {date.getDate()}{' '}
                  <span className="text-xs font-normal opacity-70">
                    {date.toLocaleString('es-MX', { month: 'short' })}
                  </span>
                </p>
                {!labora && (
                  <p className="text-xs text-gray-300 dark:text-white/15 mt-0.5">No labora</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Cuerpo */}
        <div className="grid divide-x divide-gray-50 dark:divide-white/5 min-h-[220px]" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
          {weekDates.map((date) => {
            const dayName  = DAYS_ES[date.getDay()];
            const iso      = toISO(date);
            const isFuture = iso >= todayISO;
            const labora   = diasLaborales.has(dayName);
            const citasDia = citas
              .filter((c) => c.fecha === iso)
              .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

            if (!labora) {
              return (
                <div key={iso} className="p-3 bg-gray-50/50 dark:bg-white/[0.02]" />
              );
            }

            return (
              <div key={iso} className="p-3 flex flex-col gap-2">
                {citasDia.map((cita) => {
                  const estado          = deriveEstado(cita.estado?.nombre, iso, todayISO);
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
                          <button onClick={() => openReschedule(cita)} title="Reprogramar"
                            className="w-5 h-5 flex items-center justify-center rounded-md bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-gray-500 dark:text-white/50 transition-colors cursor-pointer">
                            <CalendarClock size={10} />
                          </button>
                          <button onClick={() => setCancelTarget(cita)} title="Cancelar"
                            className="w-5 h-5 flex items-center justify-center rounded-md bg-white/60 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 dark:text-white/40 transition-colors cursor-pointer">
                            <X size={10} />
                          </button>
                        </div>
                      )}
                      {['COMPLETADA', 'CANCELADA'].includes(estado) && (
                        <button onClick={() => openNew('', String(cita.pacienteId))} title="Agendar siguiente cita"
                          className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-md bg-white/60 dark:bg-white/10 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-400 hover:text-green-600 dark:text-white/40 transition-colors cursor-pointer">
                          <CalendarPlus size={10} />
                        </button>
                      )}
                      <p className={`font-semibold truncate leading-tight ${canEdit ? 'pr-12' : ''} ${NAME_STYLE[estado] || 'text-gray-700'}`}>
                        {cita.paciente?.nombre} {cita.paciente?.apellido?.[0]}.
                      </p>
                      <p className={`opacity-70 ${NAME_STYLE[estado]}`}>{cita.horaInicio} – {cita.horaFin}</p>
                      <span className={`self-start px-1.5 py-0.5 rounded-md font-medium mt-0.5 ${BADGE_STYLE[estado] || BADGE_STYLE.PENDIENTE}`}>
                        {BADGE_LABEL[estado]}
                      </span>
                      {needsAttendance && (
                        <div className="flex gap-1 mt-1 pt-1.5 border-t border-black/5 dark:border-white/10">
                          <button onClick={() => markEstado(cita.id, 'COMPLETADA')}
                            className="flex-1 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer">
                            ✓ Llegó
                          </button>
                          <button onClick={() => markEstado(cita.id, 'FALTÓ')}
                            className="flex-1 py-1 rounded-md bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-colors cursor-pointer">
                            ✗ Faltó
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {isFuture && (
                  <button onClick={() => openNew(iso)}
                    className="mt-auto flex items-center justify-center gap-1 w-full py-1.5 rounded-lg text-xs text-gray-300 dark:text-white/20 hover:text-gray-500 dark:hover:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                    <Plus size={11} /> Agregar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal: cancelar ─────────────────────────────────────────────────────── */}
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

      {/* ── Modal: reprogramar ───────────────────────────────────────────────────── */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setRescheduleTarget(null)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Reprogramar cita</h3>
                <p className="text-xs text-amber-500 mt-0.5">Quedará como Pendiente</p>
              </div>
              <button onClick={() => setRescheduleTarget(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"><X size={14} /></button>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{rescheduleTarget.paciente?.nombre} {rescheduleTarget.paciente?.apellido}</p>
              <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5 italic">{rescheduleTarget.motivo}</p>
            </div>
            <div className="mb-4">
              <label className={labelCls}>Nueva fecha</label>
              <DatePicker
                value={rescFecha}
                onChange={onRescFechaChange}
                minDate={todayISO}
                diasLaborales={diasLaborales}
              />
            </div>
            {rescFecha && rescSlots.length === 0 && (
              <p className="text-xs text-red-500 mb-4">No hay horario disponible ese día.</p>
            )}
            {rescSlots.length > 0 && (
              <div className="mb-4">
                <label className={labelCls}>Horario disponible</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {rescSlots.map((s) => (
                    <button
                      key={s.horaInicio}
                      onClick={() => !s.ocupado && setRescSlot(s)}
                      disabled={s.ocupado}
                      className={`py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        s.ocupado
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-white/20 cursor-not-allowed line-through'
                          : rescSlot?.horaInicio === s.horaInicio
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            : 'bg-gray-50 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/20'
                      }`}
                    >
                      {s.horaInicio}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setRescheduleTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">Cancelar</button>
              <button onClick={handleReschedule} disabled={!rescFecha || !rescSlot}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white hover:opacity-80 text-white dark:text-gray-900 text-sm font-medium cursor-pointer disabled:opacity-40">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: nueva cita ────────────────────────────────────────────────────── */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Nueva cita</h3>
              <button onClick={() => setShowNew(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"><X size={14} /></button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Paciente */}
              <div>
                <label className={labelCls}>Paciente <span className="text-red-400">*</span></label>
                <select value={form.pacienteId} onChange={(e) => setForm((f) => ({ ...f, pacienteId: e.target.value }))} className={inputCls}>
                  <option value="">Seleccionar paciente…</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className={labelCls}>Fecha <span className="text-red-400">*</span></label>
                <DatePicker
                  value={form.fecha}
                  onChange={(fecha) => onFechaChange({ target: { value: fecha } })}
                  minDate={todayISO}
                  diasLaborales={diasLaborales}
                />
              </div>

              {/* Slots */}
              {form.fecha && slots.length === 0 && (
                <p className="text-xs text-red-500">No hay horario disponible ese día. Revisa tu horario laboral.</p>
              )}
              {slots.length > 0 && (
                <div>
                  <label className={labelCls}>
                    Hora disponible <span className="text-red-400">*</span>
                    <span className="text-gray-400 dark:text-white/30 ml-1">(citas de 1 hora)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.horaInicio}
                        type="button"
                        onClick={() => selectSlot(s)}
                        disabled={s.ocupado}
                        className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                          s.ocupado
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-white/20 cursor-not-allowed line-through'
                            : form.horaInicio === s.horaInicio
                              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 cursor-pointer'
                              : 'bg-gray-50 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/20 cursor-pointer'
                        }`}
                      >
                        {s.horaInicio} – {s.horaFin}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivo */}
              <div>
                <label className={labelCls}>Motivo <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="Ej. Revisión cardíaca de rutina"
                  value={form.motivo}
                  onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
                  className={inputCls}
                />
              </div>

              {formErr && <p className="text-xs text-red-500">{formErr}</p>}
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">Cancelar</button>
              <button onClick={handleCreate} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white hover:opacity-80 text-white dark:text-gray-900 text-sm font-medium cursor-pointer">
                Crear cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
