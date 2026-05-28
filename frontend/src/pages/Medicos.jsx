import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Stethoscope, Phone, Mail, Pencil, Trash2 } from 'lucide-react';
import { medicoService } from '../services/medicoService';
import { especialidadService } from '../services/especialidadService';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Select } from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const emptyCreate = { nombre: '', apellido: '', correo: '', contrasena: '', telefono: '', cedulaProfesional: '', especialidadId: '' };
const emptyEdit   = { nombre: '', apellido: '', correo: '', contrasena: '', telefono: '', cedulaProfesional: '' };

function MedicoForm({ initial, mode, especialidades, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Nombre *" value={form.nombre} onChange={set('nombre')} required placeholder="Ej. Eduardo" />
        <Input label="Apellido *" value={form.apellido} onChange={set('apellido')} required placeholder="Ej. Salinas" />
      </div>
      <Input label="Correo electrónico *" type="email" value={form.correo} onChange={set('correo')} required placeholder="medico@medicit.com" />
      {mode === 'create' ? (
        <Input label="Contraseña *" type="password" value={form.contrasena} onChange={set('contrasena')} required placeholder="Mínimo 6 caracteres" />
      ) : (
        <Input label="Nueva contraseña (dejar vacío para no cambiar)" type="password" value={form.contrasena} onChange={set('contrasena')} placeholder="Nueva contraseña..." />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Teléfono *" value={form.telefono} onChange={set('telefono')} required placeholder="5551234567" />
        <Input label="Cédula profesional *" value={form.cedulaProfesional} onChange={set('cedulaProfesional')} required placeholder="CP-00000" />
      </div>
      {mode === 'create' && (
        <Select label="Especialidad" value={form.especialidadId} onChange={set('especialidadId')}>
          <option value="">Sin especialidad</option>
          {especialidades.map((e) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </Select>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar médico'}</Button>
      </div>
    </form>
  );
}

const PALETTE = [
  'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
];

function specialtyColor(name) {
  if (!name) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}

export default function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      const [medicosRes, espRes] = await Promise.all([medicoService.getAll(), especialidadService.getAll()]);
      setMedicos(medicosRes.data);
      setEspecialidades(espRes.data);
    } catch { showToast('Error al cargar datos', 'error'); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = medicos.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.nombre?.toLowerCase().includes(q) ||
      m.apellido?.toLowerCase().includes(q) ||
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
    } catch (e) { showToast(e.response?.data || 'Error al registrar el médico', 'error'); }
    finally { setLoading(false); }
  };

  const handleEdit = async (form) => {
    setLoading(true);
    try {
      await medicoService.update(selected.id, form);
      await load();
      setModal(null);
      showToast('Médico actualizado correctamente');
    } catch (e) { showToast(e.response?.data || 'Error al actualizar', 'error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este médico?')) return;
    try {
      await medicoService.delete(id);
      await load();
      showToast('Médico eliminado');
    } catch { showToast('Error al eliminar', 'error'); }
  };

  const toEditInitial = (m) => ({
    nombre: m.nombre || '', apellido: m.apellido || '', correo: m.correo || '',
    contrasena: '', telefono: m.telefono || '', cedulaProfesional: m.cedulaProfesional || '',
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Médicos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{medicos.length} médicos en el sistema</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus size={16} /> <span className="hidden sm:inline">Nuevo médico</span>
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
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <Stethoscope size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Sin médicos registrados</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((m) => {
          const esp = m.especialidades?.[0]?.nombre;
          return (
            <div key={m.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                    {m.nombre?.[0]}{m.apellido?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.nombre} {m.apellido}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Céd. {m.cedulaProfesional}</p>
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
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium mb-4 ${specialtyColor(esp)}`}>
                  {esp}
                </span>
              )}

              <div className="flex flex-col gap-2 border-t border-gray-50 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{m.correo}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Phone size={12} className="shrink-0" />
                  <span>{m.telefono}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Registrar nuevo médico">
        <MedicoForm initial={emptyCreate} mode="create" especialidades={especialidades} onSubmit={handleCreate} onClose={() => setModal(null)} loading={loading} />
      </Modal>
      <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Editar médico">
        {selected && (
          <MedicoForm initial={toEditInitial(selected)} mode="edit" especialidades={especialidades} onSubmit={handleEdit} onClose={() => setModal(null)} loading={loading} />
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
