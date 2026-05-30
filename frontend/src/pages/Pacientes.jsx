import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { pacienteService } from '../services/pacienteService';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Select } from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const emptyCreate = { nombre: '', apellido: '', correo: '', usuario: '', contrasena: '', telefono: '', fechaNacimiento: '', genero: '', direccion: '' };
const emptyEdit   = { nombre: '', apellido: '', correo: '', telefono: '', fechaNacimiento: '', genero: '', direccion: '' };

function PacienteForm({ initial, mode, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Nombre *" value={form.nombre} onChange={set('nombre')} required placeholder="Ej. Ana" />
        <Input label="Apellido *" value={form.apellido} onChange={set('apellido')} required placeholder="Ej. García" />
      </div>
      <Input label="Correo electrónico *" type="email" value={form.correo} onChange={set('correo')} required placeholder="correo@email.com" />
      {mode === 'create' && (
        <>
          <Input label="Usuario *" value={form.usuario} onChange={set('usuario')} required placeholder="usuario123" />
          <Input label="Contraseña *" type="password" value={form.contrasena} onChange={set('contrasena')} required placeholder="Mínimo 6 caracteres" />
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Teléfono *" value={form.telefono} onChange={set('telefono')} required placeholder="5551234567" />
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
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar paciente'}</Button>
      </div>
    </form>
  );
}

const PAGE_SIZE = 4;

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      const { data } = await pacienteService.getAll();
      setPacientes(data);
    } catch {
      showToast('Error al cargar pacientes', 'error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = pacientes.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(q) ||
      p.apellido?.toLowerCase().includes(q) ||
      p.correo?.toLowerCase().includes(q)
    );
  });
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      await pacienteService.create(form);
      await load();
      setModal(null);
      showToast('Paciente registrado correctamente');
    } catch (e) {
      showToast(e.response?.data || 'Error al registrar el paciente', 'error');
    } finally { setLoading(false); }
  };

  const handleEdit = async (form) => {
    setLoading(true);
    try {
      await pacienteService.update(selected.id, form);
      await load();
      setModal(null);
      showToast('Paciente actualizado correctamente');
    } catch (e) {
      showToast(e.response?.data || 'Error al actualizar el paciente', 'error');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este paciente?')) return;
    try {
      await pacienteService.delete(id);
      await load();
      showToast('Paciente eliminado');
    } catch { showToast('Error al eliminar', 'error'); }
  };

  const calcEdad = (fecha) => {
    if (!fecha) return '-';
    const diff = Date.now() - new Date(fecha).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' años';
  };

  const toEditInitial = (p) => ({
    nombre: p.nombre || '', apellido: p.apellido || '', correo: p.correo || '',
    telefono: p.telefono || '', fechaNacimiento: p.fechaNacimiento || '',
    genero: p.genero || '', direccion: p.direccion || '',
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Pacientes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pacientes.length} registrados en total</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus size={16} /> <span className="hidden sm:inline">Nuevo paciente</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-50 dark:border-gray-700">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-700">
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paciente</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Contacto</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Edad</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Género</th>
                <th className="px-4 sm:px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 dark:text-gray-500">Sin resultados</td>
                </tr>
              )}
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.fotoPerfil ? (
                        <img src={p.fotoPerfil} alt={p.nombre} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 shrink-0">
                          {p.nombre?.[0]}{p.apellido?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{p.nombre} {p.apellido}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 md:hidden">{p.correo}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 hidden md:block">{p.direccion || 'Sin dirección'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    <p className="text-gray-700 dark:text-gray-300">{p.correo}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{p.telefono}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{calcEdad(p.fechaNacimiento)}</td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">{p.genero}</td>
                  <td className="px-4 sm:px-6 py-4">
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
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={(p) => { setPage(p); }} />
      </div>

      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Registrar nuevo paciente">
        <PacienteForm initial={emptyCreate} mode="create" onSubmit={handleCreate} onClose={() => setModal(null)} loading={loading} />
      </Modal>

      <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Editar paciente">
        {selected && (
          <PacienteForm initial={toEditInitial(selected)} mode="edit" onSubmit={handleEdit} onClose={() => setModal(null)} loading={loading} />
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
