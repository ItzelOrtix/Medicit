import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Stethoscope, Phone, Mail, Pencil, Trash2 } from 'lucide-react';
import { medicoService } from '../services/medicoService';
import { mockEspecialidades } from '../data/mockData';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Select } from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const empty = { nombre: '', apellido: '', email: '', telefono: '', cedulaProfesional: '' };

function MedicoForm({ initial = empty, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Nombre *" value={form.nombre} onChange={set('nombre')} required placeholder="Ej. Dr. Eduardo" />
        <Input label="Apellido *" value={form.apellido} onChange={set('apellido')} required placeholder="Ej. Salinas" />
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

const specialtyColors = {
  'Cardiología':      'bg-red-50 text-red-700',
  'Pediatría':        'bg-blue-50 text-blue-700',
  'Dermatología':     'bg-orange-50 text-orange-700',
  'Neurología':       'bg-purple-50 text-purple-700',
  'Medicina General': 'bg-green-50 text-green-700',
};

export default function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    const { data } = await medicoService.getAll();
    setMedicos(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = medicos.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.nombre.toLowerCase().includes(q) ||
      m.apellido.toLowerCase().includes(q) ||
      m.especialidades?.some((e) => e.nombre.toLowerCase().includes(q))
    );
  });

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
          <p className="text-sm text-gray-500 mt-1">{medicos.length} médicos en el sistema</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus size={16} /> Nuevo médico
        </Button>
      </div>

      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar médico o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Stethoscope size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Sin médicos registrados</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((m) => {
          const esp = m.especialidades?.[0]?.nombre;
          const colorCls = specialtyColors[esp] || 'bg-gray-100 text-gray-700';
          return (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                    {m.nombre.replace('Dr. ', '').replace('Dra. ', '')[0]}
                    {m.apellido[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{m.nombre} {m.apellido}</p>
                    <p className="text-xs text-gray-400">Céd. {m.cedulaProfesional}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => { setSelected(m); setModal('edit'); }}>
                    <Pencil size={13} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}>
                    <Trash2 size={13} className="text-red-400" />
                  </Button>
                </div>
              </div>

              {esp && (
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium mb-4 ${colorCls}`}>
                  {esp}
                </span>
              )}

              <div className="flex flex-col gap-2 border-t border-gray-50 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{m.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} className="shrink-0" />
                  <span>{m.telefono}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Registrar nuevo médico">
        <MedicoForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={loading} />
      </Modal>

      <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Editar médico">
        {selected && (
          <MedicoForm initial={selected} onSubmit={handleEdit} onClose={() => setModal(null)} loading={loading} />
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
