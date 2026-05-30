import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, CalendarDays, X } from 'lucide-react';
import { citaService } from '../services/citaService';
import { pacienteService } from '../services/pacienteService';
import { medicoService } from '../services/medicoService';
import { notificacionService } from '../services/notificacionService';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Select, Textarea } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';

const ESTADOS_CITA = ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'];
const PAGE_SIZE = 4;

const emptyForm = { pacienteId: '', medicoId: '', fecha: '', horaInicio: '', horaFin: '', estado: 'PENDIENTE', motivo: '', notas: '' };

function CitaForm({ initial = emptyForm, pacientes, medicos, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ ...initial, pacienteId: String(initial.pacienteId || ''), medicoId: String(initial.medicoId || ''), estado: initial.estado?.nombre || initial.estado || 'PENDIENTE' });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, pacienteId: Number(form.pacienteId), medicoId: Number(form.medicoId) }); }} className="flex flex-col gap-4">
      <Select label="Paciente *" value={form.pacienteId} onChange={set('pacienteId')} required>
        <option value="">Seleccionar paciente...</option>
        {pacientes.map((p) => (
          <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
        ))}
      </Select>
      <Select label="Médico *" value={form.medicoId} onChange={set('medicoId')} required>
        <option value="">Seleccionar médico...</option>
        {medicos.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre} {m.apellido} — {m.especialidades?.[0]?.nombre || 'General'}</option>
        ))}
      </Select>
      <Input label="Fecha *" type="date" value={form.fecha} onChange={set('fecha')} required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Hora inicio *" type="time" value={form.horaInicio} onChange={set('horaInicio')} required />
        <Input label="Hora fin *" type="time" value={form.horaFin} onChange={set('horaFin')} required />
      </div>
      <Select label="Estado" value={form.estado} onChange={set('estado')}>
        {ESTADOS_CITA.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </Select>
      <Input label="Motivo *" value={form.motivo} onChange={set('motivo')} required placeholder="Motivo de la consulta" />
      <Textarea label="Notas" value={form.notas} onChange={set('notas')} placeholder="Observaciones adicionales..." />
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar cita'}</Button>
      </div>
    </form>
  );
}

const FILTROS = ['TODOS', 'PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'];

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      const [c, p, m] = await Promise.all([
        citaService.getAll(),
        pacienteService.getAll(),
        medicoService.getAll(),
      ]);
      setCitas(c.data);
      setPacientes(p.data);
      setMedicos(m.data);
    } catch {
      showToast('Error al cargar datos', 'error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = citas.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      `${c.paciente?.nombre} ${c.paciente?.apellido}`.toLowerCase().includes(q) ||
      `${c.medico?.nombre} ${c.medico?.apellido}`.toLowerCase().includes(q);
    const matchEstado = filtroEstado === 'TODOS' || c.estado?.nombre === filtroEstado;
    return matchSearch && matchEstado;
  });

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      const { data } = await citaService.create(form);
      notificacionService.confirmarCita(data);
      await load();
      setModal(null);
      showToast('Cita registrada correctamente');
    } catch { showToast('Error al crear la cita', 'error'); }
    finally { setLoading(false); }
  };

  const handleEdit = async (form) => {
    setLoading(true);
    try {
      const { data } = await citaService.update(selected.id, form);
      notificacionService.notificarCambio(data);
      await load();
      setModal(null);
      showToast('Cita actualizada');
    } catch { showToast('Error al actualizar', 'error'); }
    finally { setLoading(false); }
  };

  const handleCancelar = async (id) => {
    if (!confirm('¿Cancelar esta cita?')) return;
    try {
      const { data } = await citaService.cancelar(id);
      notificacionService.notificarCancelacion(data);
      await load();
      showToast('Cita cancelada');
    } catch { showToast('Error al cancelar', 'error'); }
  };

  const sortedFiltered = [...filtered].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio));
  const paginated = sortedFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Citas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{citas.length} citas registradas</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus size={16} /> <span className="hidden sm:inline">Nueva cita</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente o médico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
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
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'TODOS' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-700">
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paciente</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Médico</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha y hora</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Motivo</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-4 sm:px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-14">
                    <CalendarDays size={32} className="mx-auto mb-2 text-gray-200 dark:text-gray-600" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">Sin citas registradas</p>
                  </td>
                </tr>
              )}
              {paginated.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{c.paciente?.nombre} {c.paciente?.apellido}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <p className="text-gray-700 dark:text-gray-300">{c.medico?.nombre} {c.medico?.apellido}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{c.medico?.especialidad || c.medico?.especialidades?.[0]?.nombre}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{c.fecha}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{c.horaInicio} – {c.horaFin}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 dark:text-gray-400 max-w-[180px] truncate hidden md:table-cell">{c.motivo}</td>
                  <td className="px-4 sm:px-6 py-4"><Badge text={c.estado?.nombre} /></td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="secondary" size="sm" onClick={() => { setSelected(c); setModal('edit'); }}>
                        Editar
                      </Button>
                      {c.estado?.nombre !== 'CANCELADA' && c.estado?.nombre !== 'COMPLETADA' && (
                        <Button variant="danger" size="sm" onClick={() => handleCancelar(c.id)}>
                          <X size={13} /> <span className="hidden sm:inline">Cancelar</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={sortedFiltered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Nueva cita" size="lg">
        <CitaForm pacientes={pacientes} medicos={medicos} onSubmit={handleCreate} onClose={() => setModal(null)} loading={loading} />
      </Modal>

      <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Editar / Reprogramar cita" size="lg">
        {selected && (
          <CitaForm initial={selected} pacientes={pacientes} medicos={medicos} onSubmit={handleEdit} onClose={() => setModal(null)} loading={loading} />
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
