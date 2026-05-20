import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, CalendarDays, X } from 'lucide-react';
import { citaService } from '../services/citaService';
import { pacienteService } from '../services/pacienteService';
import { medicoService } from '../services/medicoService';
import { mockEstadosCita } from '../data/mockData';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Select, Textarea } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';

const emptyForm = { pacienteId: '', medicoId: '', fecha: '', horaInicio: '', horaFin: '', estadoId: 1, motivo: '', notas: '' };

function CitaForm({ initial = emptyForm, pacientes, medicos, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ ...initial, pacienteId: String(initial.pacienteId || ''), medicoId: String(initial.medicoId || ''), estadoId: String(initial.estadoId || '1') });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, pacienteId: Number(form.pacienteId), medicoId: Number(form.medicoId), estadoId: Number(form.estadoId) }); }} className="flex flex-col gap-4">
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
      <Select label="Estado" value={form.estadoId} onChange={set('estadoId')}>
        {mockEstadosCita.map((e) => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </Select>
      <Input label="Motivo *" value={form.motivo} onChange={set('motivo')} required placeholder="Motivo de la consulta" />
      <Textarea label="Notas" value={form.notas} onChange={set('notas')} placeholder="Observaciones adicionales..." />
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
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
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    const [c, p, m] = await Promise.all([
      citaService.getAll(),
      pacienteService.getAll(),
      medicoService.getAll(),
    ]);
    setCitas(c.data);
    setPacientes(p.data);
    setMedicos(m.data);
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
      await citaService.create(form);
      await load();
      setModal(null);
      showToast('Cita registrada correctamente');
    } catch { showToast('Error al crear la cita', 'error'); }
    finally { setLoading(false); }
  };

  const handleEdit = async (form) => {
    setLoading(true);
    try {
      await citaService.update(selected.id, form);
      await load();
      setModal(null);
      showToast('Cita actualizada');
    } catch { showToast('Error al actualizar', 'error'); }
    finally { setLoading(false); }
  };

  const handleCancelar = async (id) => {
    if (!confirm('¿Cancelar esta cita?')) return;
    try {
      await citaService.cancelar(id);
      await load();
      showToast('Cita cancelada');
    } catch { showToast('Error al cancelar', 'error'); }
  };

  const sortedFiltered = [...filtered].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
          <p className="text-sm text-gray-500 mt-1">{citas.length} citas registradas</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus size={16} /> Nueva cita
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente o médico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 w-64"
          />
        </div>
        <div className="flex gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filtroEstado === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f === 'TODOS' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Médico</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha y hora</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Motivo</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedFiltered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-14">
                    <CalendarDays size={32} className="mx-auto mb-2 text-gray-200" />
                    <p className="text-sm text-gray-400">Sin citas registradas</p>
                  </td>
                </tr>
              )}
              {sortedFiltered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{c.paciente?.nombre} {c.paciente?.apellido}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{c.medico?.nombre} {c.medico?.apellido}</p>
                    <p className="text-xs text-gray-400">{c.medico?.especialidad || c.medico?.especialidades?.[0]?.nombre}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{c.fecha}</p>
                    <p className="text-xs text-gray-400">{c.horaInicio} – {c.horaFin}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">{c.motivo}</td>
                  <td className="px-6 py-4"><Badge text={c.estado?.nombre} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="secondary" size="sm" onClick={() => { setSelected(c); setModal('edit'); }}>
                        Editar
                      </Button>
                      {c.estado?.nombre !== 'CANCELADA' && c.estado?.nombre !== 'COMPLETADA' && (
                        <Button variant="danger" size="sm" onClick={() => handleCancelar(c.id)}>
                          <X size={13} /> Cancelar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
