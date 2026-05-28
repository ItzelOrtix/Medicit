import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Stethoscope } from 'lucide-react';
import { especialidadService } from '../services/especialidadService';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Textarea } from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const empty = { nombre: '', descripcion: '' };

function EspecialidadForm({ initial = empty, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-4">
      <Input label="Nombre *" value={form.nombre} onChange={set('nombre')} required placeholder="Ej. Cardiología" />
      <Textarea label="Descripción" value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción de la especialidad..." />
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar especialidad'}</Button>
      </div>
    </form>
  );
}

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      const { data } = await especialidadService.getAll();
      setEspecialidades(data);
    } catch { showToast('Error al cargar especialidades', 'error'); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      await especialidadService.create(form);
      await load();
      setModal(null);
      showToast('Especialidad creada correctamente');
    } catch (e) { showToast(e.response?.data || 'Error al crear la especialidad', 'error'); }
    finally { setLoading(false); }
  };

  const handleEdit = async (form) => {
    setLoading(true);
    try {
      await especialidadService.update(selected.id, form);
      await load();
      setModal(null);
      showToast('Especialidad actualizada correctamente');
    } catch (e) { showToast(e.response?.data || 'Error al actualizar', 'error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta especialidad?')) return;
    try {
      await especialidadService.delete(id);
      await load();
      showToast('Especialidad eliminada');
    } catch (e) { showToast(e.response?.data || 'Error al eliminar', 'error'); }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Especialidades</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{especialidades.length} especialidades registradas</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus size={16} /> <span className="hidden sm:inline">Nueva especialidad</span>
        </Button>
      </div>

      {especialidades.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <Stethoscope size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Sin especialidades registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {especialidades.map((esp) => (
            <div key={esp.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Stethoscope size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{esp.nombre}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-2">{esp.descripcion || 'Sin descripción'}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 ml-2">
                  <Button variant="ghost" size="sm" onClick={() => { setSelected(esp); setModal('edit'); }}>
                    <Pencil size={13} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(esp.id)}>
                    <Trash2 size={13} className="text-red-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Nueva especialidad">
        <EspecialidadForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={loading} />
      </Modal>
      <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Editar especialidad">
        {selected && (
          <EspecialidadForm
            initial={{ nombre: selected.nombre, descripcion: selected.descripcion || '' }}
            onSubmit={handleEdit}
            onClose={() => setModal(null)}
            loading={loading}
          />
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
