// ============================================================
// PEGA AQUÍ la URL que te dio Google al implementar el Apps Script
// ============================================================
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbw7mJkBo3E_C5sBMtKvo_jcY7PXSeTynbCoGdo8-ygtnX_moy-dVmbtZESKpoOyal1B/exec';

document.addEventListener('DOMContentLoaded', () => {
  const botonesAbrir = document.querySelectorAll('[data-abre-modal]');
  const modales = document.querySelectorAll('.modal');

  function abrirModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('esta-abierto');
    document.body.classList.add('modal-abierto');
    const primerInput = modal.querySelector('input, button.modal__cerrar');
    if (primerInput) primerInput.focus({ preventScroll: true });
  }

  function cerrarModal(modal) {
    modal.classList.remove('esta-abierto');
    document.body.classList.remove('modal-abierto');
  }

  botonesAbrir.forEach(boton => {
    boton.addEventListener('click', () => abrirModal(boton.dataset.abreModal));
  });

  modales.forEach(modal => {
    modal.querySelectorAll('[data-cierra-modal]').forEach(btn => {
      btn.addEventListener('click', () => cerrarModal(modal));
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) cerrarModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.esta-abierto').forEach(cerrarModal);
    }
  });

  // ---- Envío genérico a Google Sheets ----
  // OJO: no ponemos header 'Content-Type: application/json' a propósito.
  // Si lo ponemos, el navegador dispara una petición de "preflight" (OPTIONS)
  // que Google Apps Script no responde bien, y el envío falla por CORS.
  // Al mandarlo así, el navegador lo trata como texto plano y no hay preflight;
  // en el script de Google igual lo leemos con JSON.parse(e.postData.contents).
  async function enviarAGoogleSheets(datos) {
    const resp = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    const resultado = await resp.json();
    if (!resultado.ok) {
      throw new Error(resultado.error || 'Error desconocido al guardar los datos.');
    }
    return resultado;
  }

  // ---- Formulario "Sugerir canción" ----
  const formCancion = document.getElementById('form-cancion');
  const estadoCancion = document.getElementById('estado-cancion');

  if (formCancion) {
    formCancion.addEventListener('submit', async (e) => {
      e.preventDefault();
      const boton = formCancion.querySelector('.modal__enviar');
      boton.disabled = true;
      estadoCancion.textContent = 'Enviando...';
      estadoCancion.dataset.tipo = '';

      const datos = Object.fromEntries(new FormData(formCancion));
      datos.tipo = 'cancion';

      try {
        await enviarAGoogleSheets(datos);
        estadoCancion.textContent = '¡Gracias! Tu canción fue registrada 🎶';
        estadoCancion.dataset.tipo = 'ok';
        formCancion.reset();
      } catch (err) {
        estadoCancion.textContent = 'Hubo un problema al enviar. Intenta de nuevo.';
        estadoCancion.dataset.tipo = 'err';
        console.error(err);
      } finally {
        boton.disabled = false;
      }
    });
  }

  // ---- Formulario "Confirmación de asistencia" ----
  const formAsistencia = document.getElementById('form-asistencia');
  const estadoAsistencia = document.getElementById('estado-asistencia');

  if (formAsistencia) {
    formAsistencia.addEventListener('submit', async (e) => {
      e.preventDefault();
      const boton = formAsistencia.querySelector('.modal__enviar');
      boton.disabled = true;
      estadoAsistencia.textContent = 'Enviando...';
      estadoAsistencia.dataset.tipo = '';

      const datos = Object.fromEntries(new FormData(formAsistencia));
      datos.tipo = 'asistencia';

      try {
        await enviarAGoogleSheets(datos);
        estadoAsistencia.textContent = '¡Gracias por confirmar! 💛';
        estadoAsistencia.dataset.tipo = 'ok';
        formAsistencia.reset();
      } catch (err) {
        estadoAsistencia.textContent = 'Hubo un problema al enviar. Intenta de nuevo.';
        estadoAsistencia.dataset.tipo = 'err';
        console.error(err);
      } finally {
        boton.disabled = false;
      }
    });
  }
});