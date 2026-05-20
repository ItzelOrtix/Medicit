import { useState, useEffect, useCallback } from 'react';
import { Plus, Clock, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { horarioService } from '../services/horarioService';
import { medicoService } from '../services/medicoService';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input, { Select } from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
const DIA_LABEL = { LUNES: 'Lun', MARTES: 'Mar', MIERCOLES: 'Mié', JUEVES: 'Jue', VIERNES: 'Vie', SABADO: 'Sáb', DOMINGO: 'Dom' };

const emptyForm = { medicoId: '', diaSemana: 'LUNES', horaInicio: '09:00', horaFin: '13:00', disponible: true };

function HorarioForm({ medicos, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(emptyForm);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, medicoId: Number(form.medicoId), disponible: true }); }} className="flex flex-col gap-4">
      <Select label="Médico *" value={form.medicoId} onChange={set('medicoId')} required>
        <option value="">Seleccionar médico...</option>
        {medicos.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
        ))}
      </Select>
      <Select label="Día de la semana *" value={form.diaSemana} onChange={set('diaSemana')} required>
        {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Hora inicio *" type="time" value={form.horaInicio} onChange={set('horaInicio')} required />
        <Input label="Hora fin *" type="time" value={form.horaFin} onChange={set('horaFin')} required />
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Agregar horario'}</Button>
      </div>
    </form>
  );
}

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState('todos');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    const [h, m] = await Promise.all([horarioService.getAll(), medicoService.getAll()]);
    setHorarios(h.data);
    setMedicos(m.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredMedicos = medicoSeleccionado === 'todos'
    ? medicos
    : medicos.filter((m) => String(m.id) === medicoSeleccionado);

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      await horarioService.create(form);
      await load();
      setModal(false);
      showToast('Horario agregado correctamente');
    } catch { showToast('Error al agregar horario', 'error'); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    try {
      await horarioService.toggleDisponibilidad(id);
      await load();
    } catch { showToast('Error al cambiar disponibilidad', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este horario?')) return;
    try {
      await horarioService.delete(id);
      await load();
      showToast('Horario eliminado');
    } catch { showToast('Error al eliminar', 'error'); }
  };

  const getHorariosMedico = (medicoId) =>
    horarios.filter((h) => h.medicoId === medicoId);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Horarios</h1>
          <p className="text-sm text-gray-500 mt-1">Disponibilidad de los médicos por día</p>
        </div>
        <Button onClick={() => setModal(true)}>
          <Plus size={16} /> Agregar horario
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setMedicoSeleccionado('todos')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${medicoSeleccionado === 'todos' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          Todos
        </button>
        {medicos.map((m) => (
          <button
            key={m.id}
            onClick={() => setMedicoSeleccionado(String(m.id))}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${String(m.id) === medicoSeleccionado ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {m.nombre} {m.apellido}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredMedicos.map((medico) => {
          const horas = getHorariosMedico(medico.id);
          return (
            <div key={medico.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                  {medico.nombre[0]}{medico.apellido[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{medico.nombre} {medico.apellido}</p>
                  <p className="text-xs text-gray-400">{medico.especialidades?.[0]?.nombre || 'Sin especialidad'}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {horas.length} horarios
                </span>
              </div>

              {horas.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Sin horarios definidos</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-0 divide-x divide-gray-50">
                  {DIAS.map((dia) => {
                    const diaHoras = horas.filter((h) => h.diaSemana === dia);
                    return (
                      <div key={dia} className="p-4 min-h-[100px]">
                        <p className="text-xs font-semibold text-gray-400 mb-2">{DIA_LABEL[dia]}</p>
                        <div className="flex flex-col gap-2">
                          {diaHoras.map((h) => (
                            <div key={h.id} className={`rounded-lg p-2 text-xs border ${h.disponible ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 opacity-50'}`}>
                              <p className="font-medium text-gray-700">{h.horaInicio}–{h.horaFin}</p>
                              <div className="flex items-center justify-between mt-1.5 gap-1">
                                <button onClick={() => handleToggle(h.id)} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                                  {h.disponible
                                    ? <ToggleRight size={16} className="text-green-500" />
                                    : <ToggleLeft size={16} />}
                                </button>
                                <button onClick={() => handleDelete(h.id)} className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredMedicos.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Clock size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Sin médicos encontrados</p>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Agregar horario">
        <HorarioForm medicos={medicos} onSubmit={handleCreate} onClose={() => setModal(false)} loading={loading} />
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
