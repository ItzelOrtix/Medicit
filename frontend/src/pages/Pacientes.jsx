import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, User } from 'lucide-react';
import { pacienteService } from '../services/pacienteService';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Select } from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const empty = { nombre: '', apellido: '', email: '', telefono: '', fechaNacimiento: '', genero: '', direccion: '' };

function PacienteForm({ initial = empty, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Nombre *" value={form.nombre} onChange={set('nombre')} required placeholder="Ej. Ana" />
        <Input label="Apellido *" value={form.apellido} onChange={set('apellido')} required placeholder="Ej. García" />
      </div>
      <Input label="Correo electrónico *" type="email" value={form.email} onChange={set('email')} required placeholder="correo@email.com" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Teléfono *" value={form.telefono} onChange={set('telefono')} required placeholder="555-0000" />
        <Input label="Fecha de nacimiento *" type="date" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} required />
      </div>
      <Select label="Género *" value={form.genero} onChange={set('genero')} required>
        <option value="">Seleccionar...</option>
        <option>Masculino</option>
        <option>Femenino</option>
        <option>Otro</option>
        <option>Prefiero no decir</option>
      </Select>
      <Input label="Dirección" value={form.direccion} onChange={set('direccion')} placeholder="Calle, número, ciudad" />
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar paciente'}</Button>
      </div>
    </form>
  );
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    const { data } = await pacienteService.getAll();
    setPacientes(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = pacientes.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      await pacienteService.create(form);
      await load();
      setModal(null);
      showToast('Paciente registrado correctamente');
    } catch {
      showToast('Error al registrar el paciente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (form) => {
    setLoading(true);
    try {
      await pacienteService.update(selected.id, form);
      await load();
      setModal(null);
      showToast('Paciente actualizado correctamente');
    } catch {
      showToast('Error al actualizar el paciente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este paciente?')) return;
    try {
      await pacienteService.delete(id);
      await load();
      showToast('Paciente eliminado');
    } catch {
      showToast('Error al eliminar', 'error');
    }
  };

  const calcEdad = (fecha) => {
    if (!fecha) return '-';
    const diff = Date.now() - new Date(fecha).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' años';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-sm text-gray-500 mt-1">{pacientes.length} registrados en total</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus size={16} /> Nuevo paciente
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-50">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Edad</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Género</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Sin resultados</td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                        {p.nombre[0]}{p.apellido[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.nombre} {p.apellido}</p>
                        <p className="text-xs text-gray-400">{p.direccion || 'Sin dirección'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{p.email}</p>
                    <p className="text-xs text-gray-400">{p.telefono}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{calcEdad(p.fechaNacimiento)}</td>
                  <td className="px-6 py-4 text-gray-600">{p.genero}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setSelected(p); setModal('edit'); }}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={14} className="text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Registrar nuevo paciente">
        <PacienteForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={loading} />
      </Modal>

      <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Editar paciente">
        {selected && (
          <PacienteForm initial={selected} onSubmit={handleEdit} onClose={() => setModal(null)} loading={loading} />
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
