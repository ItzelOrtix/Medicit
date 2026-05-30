const JS_DIA = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

function pad(n) { return String(n).padStart(2, '0'); }

export function diaSemanaDeISO(fecha) {
  return JS_DIA[new Date(fecha + 'T00:00').getDay()];
}

/**
 * Genera slots de 1 hora a partir de los horarios del médico para la fecha dada.
 * Marca como ocupado cada slot que ya tiene una cita activa.
 */
export function generarSlots(horarios, fecha, citasExistentes = []) {
  if (!fecha || !horarios.length) return [];
  const diaNombre = diaSemanaDeISO(fecha);
  const activos = horarios.filter(
    (h) => h.diaSemana === diaNombre && h.disponible !== false
  );
  const slots = [];
  for (const h of activos) {
    const [sh, sm] = h.horaInicio.split(':').map(Number);
    const [eh, em] = h.horaFin.split(':').map(Number);
    let cur = sh * 60 + sm;
    const fin = eh * 60 + em;
    while (cur + 60 <= fin) {
      const ini = `${pad(Math.floor(cur / 60))}:${pad(cur % 60)}`;
      const end = `${pad(Math.floor((cur + 60) / 60))}:${pad((cur + 60) % 60)}`;
      const ocupado = citasExistentes.some(
        (c) =>
          c.fecha === fecha &&
          c.horaInicio === ini &&
          (c.estado?.nombre || c.estado) !== 'CANCELADA'
      );
      slots.push({ horaInicio: ini, horaFin: end, ocupado });
      cur += 60;
    }
  }
  return slots;
}
