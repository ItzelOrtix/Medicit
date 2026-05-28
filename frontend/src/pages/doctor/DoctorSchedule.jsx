import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X } from 'lucide-react';
import { horarioService } from '../../services/horarioService';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
const DIA_LABEL = { LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles', JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo' };

const inputCls = 'w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors';
const labelCls = 'text-xs text-gray-500 dark:text-white/50 mb-1.5 block';

export default function DoctorSchedule() {
  const medicoId = parseInt(localStorage.getItem('medicit_medico_id'));
  const [horarios, setHorarios] = useState([]);
  const [toast,    setToast]    = useState(null);

  // Modal agregar
  const [showAdd,  setShowAdd]  = useState(false);
  const [addDias,  setAddDias]  = useState([]);
  const [addInicio,setAddInicio]= useState('08:00');
  const [addFin,   setAddFin]   = useState('14:00');
  const [addErr,   setAddErr]   = useState('');

  const toggleDia = (dia) =>
    setAddDias((prev) => prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]);

  // Modal editar
  const [editTarget, setEditTarget] = useState(null);
  const [editInicio, setEditInicio] = useState('');
  const [editFin,    setEditFin]    = useState('');

  const load = useCallback(async () => {
    try {
      const res = await horarioService.getByMedico(medicoId);
      setHorarios(res.data || []);
    } catch {}
  }, [medicoId]);

  useEffect(() => { load(); }, [load]);

  const showMsg = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (addDias.length === 0) { setAddErr('Selecciona al menos un día.'); return; }
    if (addFin <= addInicio)  { setAddErr('La hora de fin debe ser mayor a la de inicio.'); return; }
    try {
      await Promise.all(
        addDias.map((dia) =>
          horarioService.create({ medicoId, diaSemana: dia, horaInicio: addInicio, horaFin: addFin, disponible: true })
        )
      );
      await load();
      setShowAdd(false);
      setAddErr('');
      showMsg(`Turno agregado para ${addDias.length} día${addDias.length > 1 ? 's' : ''}`);
    } catch (err) {
      showMsg(err?.response?.data || 'Error al agregar', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      await horarioService.toggleDisponibilidad(id);
      await load();
    } catch { showMsg('Error al cambiar disponibilidad', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await horarioService.delete(id);
      await load();
      showMsg('Horario eliminado');
    } catch { showMsg('Error al eliminar', 'error'); }
  };

  const openEdit = (h) => {
    setEditTarget(h);
    setEditInicio(h.horaInicio);
    setEditFin(h.horaFin);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (editFin <= editInicio) return;
    try {
      await horarioService.update(editTarget.id, {
        medicoId,
        diaSemana:  editTarget.diaSemana,
        horaInicio: editInicio,
        horaFin:    editFin,
        disponible: editTarget.disponible,
      });
      await load();
      setEditTarget(null);
      showMsg('Horario actualizado');
    } catch { showMsg('Error al actualizar', 'error'); }
  };

  const getHorariosDia = (dia) => horarios.filter((h) => h.diaSemana === dia);

  return (
    <div className="p-8 max-w-5xl mx-auto">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi horario laboral</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
            Define los días y horas en que atiendes. Solo se pueden agendar citas dentro de tu horario.
          </p>
        </div>
        <button
          onClick={() => { setAddDias([]); setAddErr(''); setShowAdd(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Plus size={15} /> Agregar turno
        </button>
      </div>

      {/* Grid por día */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DIAS.map((dia) => {
          const diaHorarios = getHorariosDia(dia);
          const activo = diaHorarios.some((h) => h.disponible);
          return (
            <div key={dia} className={`rounded-2xl border p-4 transition-colors ${activo ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-white/10' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 opacity-70'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{DIA_LABEL[dia]}</p>
                {diaHorarios.length === 0 && (
                  <span className="text-xs text-gray-400 dark:text-white/30">Sin turnos</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {diaHorarios.map((h) => (
                  <div key={h.id} className={`rounded-xl px-3 py-2 border text-xs flex items-center justify-between gap-2 ${h.disponible ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/30' : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 line-through opacity-60'}`}>
                    <span className="font-medium text-gray-800 dark:text-white/80">
                      {h.horaInicio} – {h.horaFin}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEdit(h)} title="Editar" className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer">
                        <Pencil size={11} />
                      </button>
                      <button onClick={() => handleToggle(h.id)} title={h.disponible ? 'Desactivar' : 'Activar'} className="cursor-pointer">
                        {h.disponible
                          ? <ToggleRight size={16} className="text-green-500" />
                          : <ToggleLeft size={16} className="text-gray-400 dark:text-white/30" />}
                      </button>
                      <button onClick={() => handleDelete(h.id)} title="Eliminar" className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => { setAddDias([dia]); setAddErr(''); setShowAdd(true); }}
                  className="text-xs text-gray-400 dark:text-white/20 hover:text-gray-600 dark:hover:text-white/50 py-1 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={11} /> Agregar turno
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal agregar turno */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Agregar turno</h3>
              <button onClick={() => setShowAdd(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"><X size={14} /></button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Días <span className="text-gray-400 dark:text-white/30">(puedes elegir varios)</span></label>
                <div className="grid grid-cols-4 gap-1.5">
                  {DIAS.map((d) => (
                    <button
                      key={d} type="button"
                      onClick={() => toggleDia(d)}
                      className={`py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        addDias.includes(d)
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-gray-50 dark:bg-white/10 text-gray-600 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/20'
                      }`}
                    >
                      {DIA_LABEL[d].slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Hora inicio</label>
                  <input type="time" value={addInicio} onChange={(e) => setAddInicio(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Hora fin</label>
                  <input type="time" value={addFin} onChange={(e) => setAddFin(e.target.value)} className={inputCls} required />
                </div>
              </div>
              {addErr && <p className="text-xs text-red-500">{addErr}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 cursor-pointer">
                  Guardar {addDias.length > 1 ? `(${addDias.length} días)` : ''}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar turno */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditTarget(null)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Editar turno — {DIA_LABEL[editTarget.diaSemana]}</h3>
              <button onClick={() => setEditTarget(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer"><X size={14} /></button>
            </div>
            <form onSubmit={handleEdit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Hora inicio</label>
                  <input type="time" value={editInicio} onChange={(e) => setEditInicio(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Hora fin</label>
                  <input type="time" value={editFin} onChange={(e) => setEditFin(e.target.value)} className={inputCls} required />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setEditTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 cursor-pointer">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl text-sm font-medium shadow-lg z-50 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
