function iniciarCountdown(fechaObjetivoISO, elementos) {
  const objetivo = new Date(fechaObjetivoISO).getTime();

  function actualizar() {
    const ahora = Date.now();
    const restante = objetivo - ahora;

    if (restante <= 0) {
      elementos.dias.textContent = '0';
      elementos.horas.textContent = '0';
      elementos.min.textContent = '0';
      elementos.seg.textContent = '0';
      clearInterval(temporizador);
      return;
    }

    const dias  = Math.floor(restante / 86400000);
    const horas = Math.floor((restante % 86400000) / 3600000);
    const min   = Math.floor((restante % 3600000) / 60000);
    const seg   = Math.floor((restante % 60000) / 1000);

    elementos.dias.textContent  = dias;
    elementos.horas.textContent = horas;
    elementos.min.textContent   = min;
    elementos.seg.textContent   = seg;
  }

  actualizar();
  const temporizador = setInterval(actualizar, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarCountdown('2026-08-16T15:00:00-05:00', {
    dias:  document.getElementById('cd-dias'),
    horas: document.getElementById('cd-horas'),
    min:   document.getElementById('cd-min'),
    seg:   document.getElementById('cd-seg'),
  });
});