import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const JS_DIA = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];

export default function DatePicker({ value, onChange, minDate, diasLaborales = new Set() }) {
  const init = value ? new Date(value + 'T12:00:00') : new Date();
  const [view, setView] = useState(new Date(init.getFullYear(), init.getMonth(), 1));

  const year  = view.getFullYear();
  const month = view.getMonth();
  const today = new Date().toISOString().split('T')[0];

  const fmt = (d) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const isDisabled = (d) => {
    const iso = fmt(d);
    if (iso < (minDate || today)) return true;
    if (diasLaborales.size === 0) return false;
    const dow = new Date(iso + 'T12:00:00').getDay();
    return !diasLaborales.has(JS_DIA[dow]);
  };

  const startDow = new Date(year, month, 1).getDay();
  const blanks   = startDow === 0 ? 6 : startDow - 1;
  const days     = new Date(year, month + 1, 0).getDate();
  const cells    = [...Array(blanks).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-white/10">
        <button type="button" onClick={() => setView(new Date(year, month - 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer text-gray-500 dark:text-white/50">
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs font-semibold text-gray-700 dark:text-white/80">
          {MONTHS_ES[month]} {year}
        </span>
        <button type="button" onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer text-gray-500 dark:text-white/50">
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 px-2 pt-2 pb-1">
        {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 dark:text-white/30 py-1">{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`b${i}`} />;
          const iso      = fmt(d);
          const disabled = isDisabled(d);
          const selected = iso === value;
          const isToday  = iso === today;
          return (
            <button key={iso} type="button" onClick={() => !disabled && onChange(iso)}
              disabled={disabled}
              className={`mx-auto my-0.5 w-8 h-8 flex items-center justify-center rounded-xl text-xs transition-colors ${
                selected   ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold cursor-pointer'
                : disabled ? 'text-gray-200 dark:text-white/15 cursor-not-allowed'
                : isToday  ? 'text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer'
                           : 'text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
