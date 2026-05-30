import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, CalendarDays, X, CalendarClock } from 'lucide-react';
import { citaService } from '../services/citaService';
import { horarioService } from '../services/horarioService';
import { notificacionService } from '../services/notificacionService';
import { generarSlots } from '../utils/slots';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const PAGE_SIZE = 4;


const FILTROS = ['TODOS', 'PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'];

const LIMITE_REPROGRAMAR_HORAS = 12;

function horasRestantes(cita) {
  const citaFecha = new Date(`${cita.fecha}T${cita.horaInicio}`);
  return (citaFecha - new Date()) / (1000 * 60 * 60);
}

function ReprogramarForm({ cita, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ fecha: '', horaInicio: '', horaFin: '' });
  const [horariosMedico, setHorariosMedico] = useState([]);
  const [citasMedico, setCitasMedico] = useState([]);
  const horas = horasRestantes(cita);

  useEffect(() => {
    if (!cita.medicoId) return;
    horarioService.getByMedico(cita.medicoId)
      .then((r) => setHorariosMedico(r.data || []))
      .catch(() => {});
    citaService.getAll()
      .then((r) => setCitasMedico(r.data.filter((c) => c.medicoId === cita.medicoId && c.id !== cita.id)))
      .catch(() => {});
  }, [cita.medicoId]);

  const slots = form.fecha ? generarSlots(horariosMedico, form.fecha, citasMedico) : [];

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-4">
      <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-600 dark:text-white/60">
        <p className="font-medium text-gray-900 dark:text-white">
          {cita.medico?.nombre} {cita.medico?.apellido}
        </p>
        <p className="text-xs mt-0.5">{cita.motivo}</p>
      </div>

      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-xl px-4 py-3">
        <CalendarClock size={15} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Tiempo para reprogramar: {horas > 0 ? `${Math.floor(horas)}h ${Math.floor((horas % 1) * 60)}min` : 'Expirado'}
          </p>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/60 mt-0.5">
            Solo se aceptan reprogramaciones con al menos {LIMITE_REPROGRAMAR_HORAS} horas de anticipación.
          </p>
        </div>
      </div>

      <Input
        label="Nueva fecha *"
        type="date"
        value={form.fecha}
        onChange={(e) => setForm({ fecha: e.target.value, horaInicio: '', horaFin: '' })}
        required
      />

      {form.fecha && (
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
                    onClick={() => !s.ocupado && setForm((p) => ({ ...p, horaInicio: s.horaInicio, horaFin: s.horaFin }))}
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
                    {s.ocupado && <span className="block text-xs opacity-70">Ocupado</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading || !form.horaInicio || !form.horaFin}>
          {loading ? 'Guardando...' : 'Confirmar cambio'}
        </Button>
      </div>
    </form>
  );
}

export default function MisCitas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    const { data } = await citaService.getAll();
    setCitas(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = citas.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      `${c.medico?.nombre} ${c.medico?.apellido}`.toLowerCase().includes(q) ||
      (c.medico?.especialidad || '').toLowerCase().includes(q) ||
      c.motivo.toLowerCase().includes(q);
    const matchEstado = filtroEstado === 'TODOS' || c.estado?.nombre === filtroEstado;
    return matchSearch && matchEstado;
  });

  const sorted = [...filtered].sort(
    (a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio)
  );
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCancelar = async (cita) => {
    if (!confirm('¿Deseas cancelar esta cita?')) return;
    try {
      const { data } = await citaService.cancelar(cita.id);
      notificacionService.notificarCancelacion(data);
      await load();
      showToast('Cita cancelada');
    } catch {
      showToast('Error al cancelar la cita', 'error');
    }
  };

  const handleReprogramar = async (form) => {
    if (horasRestantes(selected) <= LIMITE_REPROGRAMAR_HORAS) {
      showToast(`No es posible reprogramar con menos de ${LIMITE_REPROGRAMAR_HORAS} horas de anticipación`, 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        pacienteId: selected.pacienteId,
        medicoId:   selected.medicoId,
        fecha:      form.fecha,
        horaInicio: form.horaInicio,
        horaFin:    form.horaFin,
        estado:     selected.estado?.nombre || selected.estado,
        motivo:     selected.motivo,
        notas:      selected.notas,
      };
      const { data } = await citaService.update(selected.id, payload);
      notificacionService.notificarCambio(data);
      await load();
      setModal(null);
      showToast('Cita reprogramada correctamente');
    } catch (e) {
      showToast(e.response?.data || 'Error al reprogramar la cita', 'error');
    } finally {
      setLoading(false);
    }
  };

  const canCancel = (c) =>
    c.estado?.nombre !== 'CANCELADA' && c.estado?.nombre !== 'COMPLETADA';

  const canReprogramar = (c) =>
    canCancel(c) && horasRestantes(c) > LIMITE_REPROGRAMAR_HORAS;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis citas</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{citas.length} citas registradas</p>
        </div>
        <Button onClick={() => navigate('/nueva-cita')}>
          <Plus size={16} /> Nueva cita
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar médico o motivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-64"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filtroEstado === f
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-white/60 dark:border-white/10 dark:hover:bg-white/5'
              }`}
            >
              {f === 'TODOS' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Médico</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Fecha y hora</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Motivo</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <CalendarDays size={32} className="mx-auto mb-2 text-gray-200 dark:text-white/10" />
                    <p className="text-sm text-gray-400 dark:text-white/30">Sin citas registradas</p>
                    <button
                      onClick={() => navigate('/nueva-cita')}
                      className="mt-3 text-sm text-gray-900 dark:text-white underline underline-offset-2 cursor-pointer"
                    >
                      Agendar una cita
                    </button>
                  </td>
                </tr>
              )}
              {paginated.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {c.medico?.nombre} {c.medico?.apellido}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/30">
                      {c.medico?.especialidad || c.medico?.especialidades?.[0]?.nombre}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{c.fecha}</p>
                    <p className="text-xs text-gray-400 dark:text-white/30">{c.horaInicio} – {c.horaFin}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-white/60 max-w-[160px] truncate">
                    {c.motivo}
                  </td>
                  <td className="px-6 py-4">
                    <Badge text={c.estado?.nombre} />
                  </td>
                  <td className="px-6 py-4">
                    {canCancel(c) && (
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {canReprogramar(c) ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => { setSelected(c); setModal('reprogramar'); }}
                          >
                            <CalendarClock size={13} /> Reprogramar
                          </Button>
                        ) : (
                          <span
                            title={`Solo se puede reprogramar con más de ${LIMITE_REPROGRAMAR_HORAS}h de anticipación`}
                            className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/20 px-2 py-1 border border-gray-200 dark:border-white/10 rounded-lg cursor-not-allowed select-none"
                          >
                            <CalendarClock size={12} /> Sin reprogramación
                          </span>
                        )}
                        <Button variant="danger" size="sm" onClick={() => handleCancelar(c)}>
                          <X size={13} /> Cancelar
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={sorted.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      <Modal
        isOpen={modal === 'reprogramar'}
        onClose={() => setModal(null)}
        title="Reprogramar cita"
        size="md"
      >
        {selected && (
          <ReprogramarForm
            cita={selected}
            onSubmit={handleReprogramar}
            onClose={() => setModal(null)}
            loading={loading}
          />
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
