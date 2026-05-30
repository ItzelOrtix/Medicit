import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { medicoService } from '../services/medicoService';
import { horarioService } from '../services/horarioService';
import { citaService } from '../services/citaService';
import { especialidadService } from '../services/especialidadService';
import { generarSlots } from '../utils/slots';
import Button from '../components/ui/Button';
import Input, { Select, Textarea } from '../components/ui/Input';
import DatePicker from '../components/ui/DatePicker';
import Toast from '../components/ui/Toast';
import { notificacionService } from '../services/notificacionService';

const DIAS_ES = {
  LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo',
};
const JS_DIA = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

const emptyForm = {
  especialidadId: '', medicoId: '', fecha: '',
  horaInicio: '', horaFin: '', motivo: '', notas: '',
};

export default function NuevaCita() {
  const navigate = useNavigate();
  const pacienteId = JSON.parse(localStorage.getItem('medicit_user') || '{}').id;
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [citasMedico, setCitasMedico] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    medicoService.getAll().then((r) => setMedicos(r.data)).catch(() => {});
    especialidadService.getAll().then((r) => setEspecialidades(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.medicoId) { setHorarios([]); setCitasMedico([]); return; }
    const mid = Number(form.medicoId);
    horarioService.getByMedico(mid).then((r) => setHorarios(r.data || [])).catch(() => {});
    citaService.getAll()
      .then((r) => setCitasMedico(r.data.filter((c) => c.medicoId === mid)))
      .catch(() => {});
  }, [form.medicoId]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleEspecialidadChange = (e) => {
    setForm((p) => ({ ...p, especialidadId: e.target.value, medicoId: '' }));
  };

  const medicosFiltrados = form.especialidadId
    ? medicos.filter((m) => m.especialidades?.some((e) => e.id === Number(form.especialidadId)))
    : medicos;

  const medicoSeleccionado = medicos.find((m) => m.id === Number(form.medicoId));
  const horariosDisponibles = horarios.filter((h) => h.disponible !== false);
  const diasLaborales = new Set(horariosDisponibles.map((h) => h.diaSemana));
  const today = new Date().toISOString().split('T')[0];
  const slots = form.fecha && horarios.length > 0
    ? generarSlots(horarios, form.fecha, citasMedico)
    : [];

  const seleccionarSlot = (s) => {
    if (s.ocupado) return;
    setForm((p) => ({ ...p, horaInicio: s.horaInicio, horaFin: s.horaFin }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await citaService.create({
        pacienteId,
        medicoId: Number(form.medicoId),
        fecha: form.fecha,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        estadoId: 1,
        motivo: form.motivo,
        notas: form.notas,
      });
      notificacionService.confirmarCita(data);
      showToast('¡Cita agendada correctamente!');
      setTimeout(() => navigate('/mis-citas'), 1500);
    } catch {
      showToast('Error al agendar la cita', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ChevronLeft size={16} /> Volver
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agendar cita</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
          Selecciona un médico y elige el horario que más te convenga
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Especialidad y médico */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Especialidad y médico</h2>
          <div className="flex flex-col gap-4">
            <Select
              label="Especialidad"
              value={form.especialidadId}
              onChange={handleEspecialidadChange}
            >
              <option value="">Todas las especialidades</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </Select>

            <Select label="Médico *" value={form.medicoId} onChange={set('medicoId')} required
              disabled={medicosFiltrados.length === 0}
            >
              <option value="">
                {form.especialidadId && medicosFiltrados.length === 0
                  ? 'Sin médicos para esta especialidad'
                  : 'Seleccionar médico...'}
              </option>
              {medicosFiltrados.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} {m.apellido} — {m.especialidades?.[0]?.nombre || 'General'}
                </option>
              ))}
            </Select>
          </div>

          {medicoSeleccionado && horariosDisponibles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
              <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">
                Días disponibles
              </p>
              <div className="flex flex-wrap gap-2">
                {horariosDisponibles.map((h) => (
                  <span
                    key={h.id}
                    className="text-xs bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 px-3 py-1.5 rounded-lg"
                  >
                    {DIAS_ES[h.diaSemana] || h.diaSemana} · {h.horaInicio}–{h.horaFin}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fecha y hora */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Fecha y hora</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-white/60 mb-1.5 block">Fecha *</label>
              {form.medicoId ? (
                <DatePicker
                  value={form.fecha}
                  onChange={(iso) => setForm((p) => ({ ...p, fecha: iso, horaInicio: '', horaFin: '' }))}
                  minDate={today}
                  diasLaborales={diasLaborales}
                />
              ) : (
                <p className="text-xs text-gray-400 dark:text-white/30 py-2">Selecciona un médico primero</p>
              )}
            </div>

            {form.fecha && form.medicoId && (
              slots.length === 0 ? (
                <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 rounded-xl px-4 py-3">
                  El médico no tiene horario disponible ese día. Elige otra fecha.
                </p>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-white/60 mb-2">
                    Horarios del día <span className="text-xs text-gray-400 dark:text-white/30">(citas de 1 hora)</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((s) => {
                      const seleccionado = form.horaInicio === s.horaInicio;
                      return (
                        <button
                          key={s.horaInicio}
                          type="button"
                          onClick={() => seleccionarSlot(s)}
                          disabled={s.ocupado}
                          className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                            s.ocupado
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-400/60 border border-red-100 dark:border-red-900/30 cursor-not-allowed line-through'
                              : seleccionado
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 cursor-pointer'
                                : 'bg-gray-50 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/20 cursor-pointer'
                          }`}
                        >
                          {s.horaInicio} – {s.horaFin}
                          {s.ocupado && <span className="block text-xs opacity-70 no-underline">Ocupado</span>}
                        </button>
                      );
                    })}
                  </div>
                  {!form.horaInicio && (
                    <p className="text-xs text-gray-400 dark:text-white/30 mt-2">Selecciona un horario disponible</p>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Motivo */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Motivo de consulta</h2>
          <div className="flex flex-col gap-4">
            <Input
              label="Motivo *"
              value={form.motivo}
              onChange={set('motivo')}
              required
              placeholder="Describe brevemente el motivo de tu consulta"
            />
            <Textarea
              label="Notas adicionales"
              value={form.notas}
              onChange={set('notas')}
              placeholder="Información adicional para el médico..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit" disabled={loading || !form.horaInicio || !form.horaFin}>
            {loading ? 'Agendando...' : 'Confirmar cita'}
          </Button>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
