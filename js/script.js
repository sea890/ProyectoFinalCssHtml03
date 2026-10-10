'use strict';

document.documentElement.classList.add('js');

function iniciarMenu() {
  const boton = document.querySelector('.boton-menu');
  const menu = document.getElementById('menu-principal');
  if (!boton || !menu) return;

  boton.hidden = false;

  function cambiarMenu(abierto) {
    boton.setAttribute('aria-expanded', String(abierto));
    menu.classList.toggle('menu--abierto', abierto);
  }

  boton.addEventListener('click', function () {
    const estaAbierto = boton.getAttribute('aria-expanded') === 'true';
    cambiarMenu(!estaAbierto);
  });

  // La tecla Escape cierra el menú y devuelve el foco al botón
  document.addEventListener('keydown', function (evento) {
    const estaAbierto = boton.getAttribute('aria-expanded') === 'true';
    if (evento.key === 'Escape' && estaAbierto) {
      cambiarMenu(false);
      boton.focus();
    }
  });
}

function iniciarAcordeones() {
  const botones = document.querySelectorAll('.acordeon__boton');

  botones.forEach(function (boton) {
    const panel = document.getElementById(boton.getAttribute('aria-controls'));
    if (!panel) return;

    boton.setAttribute('aria-expanded', 'false');
    panel.hidden = true;

    boton.addEventListener('click', function () {
      const estaAbierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!estaAbierto));
      panel.hidden = estaAbierto;
    });
  });
}

function iniciarQuiz() {
  const formulario = document.getElementById('formulario-quiz');
  const resultado = document.getElementById('resultado-quiz');
  if (!formulario || !resultado) return;

  const preguntas = formulario.querySelectorAll('.pregunta');

  function limpiarPregunta(pregunta) {
    pregunta.classList.remove('pregunta--correcta', 'pregunta--incorrecta');
    pregunta.querySelector('.pregunta__mensaje').textContent = '';
  }

  function anunciar(texto) {
    resultado.textContent = '';
    setTimeout(function () {
      resultado.textContent = texto;
      resultado.scrollIntoView({ block: 'nearest' });
    }, 100);
  }

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const faltan = [];
    preguntas.forEach(function (pregunta, indice) {
      if (!pregunta.querySelector('input[type="radio"]:checked')) {
        faltan.push(indice + 1);
      }
    });

    if (faltan.length > 0) {
      preguntas.forEach(function (pregunta, indice) {
        limpiarPregunta(pregunta);
        if (faltan.includes(indice + 1)) {
          pregunta.querySelector('.pregunta__mensaje').textContent = 'Falta responder esta pregunta.';
        }
      });
      const lista = faltan.join(', ');
      anunciar(faltan.length === 1
        ? 'Te falta responder la pregunta ' + lista + '.'
        : 'Te faltan las preguntas ' + lista + '.');
      return;
    }

    let aciertos = 0;
    const detalle = [];

    preguntas.forEach(function (pregunta, indice) {
      const elegida = pregunta.querySelector('input[type="radio"]:checked');
      const mensaje = pregunta.querySelector('.pregunta__mensaje');
      limpiarPregunta(pregunta);

      if (elegida.hasAttribute('data-correcta')) {
        aciertos++;
        pregunta.classList.add('pregunta--correcta');
        mensaje.textContent = 'Correcto ✔';
        detalle.push('Pregunta ' + (indice + 1) + ': correcta.');
      } else {
        pregunta.classList.add('pregunta--incorrecta');
        mensaje.textContent = 'Intenta otra vez ✘';
        detalle.push('Pregunta ' + (indice + 1) + ': intenta otra vez.');
      }
    });

    const total = preguntas.length;
    let resumen;
    if (aciertos === total) {
      resumen = '¡Excelente! Acertaste ' + aciertos + ' de ' + total + '.';
    } else {
      resumen = 'Acertaste ' + aciertos + ' de ' + total + '. Cambia las respuestas que dicen “Intenta otra vez” y vuelve a revisar.';
    }
    anunciar(resumen + ' ' + detalle.join(' '));
  });

  formulario.addEventListener('change', function (evento) {
    const pregunta = evento.target.closest('.pregunta');
    if (pregunta) limpiarPregunta(pregunta);
    resultado.textContent = '';
  });

  formulario.addEventListener('reset', function () {
    preguntas.forEach(limpiarPregunta);
    anunciar('Listo. Borré tus respuestas y puedes empezar de nuevo.');
  });
}

function iniciarSaltos() {
  const enlaces = document.querySelectorAll('a[href^="#"]');

  enlaces.forEach(function (enlace) {
    const id = enlace.getAttribute('href').slice(1);
    if (!id) return;

    enlace.addEventListener('click', function () {
      const destino = document.getElementById(id);

      if (!destino || !destino.matches('.leccion, .quiz')) return;

      const titulo = destino.querySelector('h2');
      setTimeout(function () {
        titulo.focus({ preventScroll: true });
      }, 0);
    });
  });
}

iniciarMenu();
iniciarAcordeones();
iniciarQuiz();
iniciarSaltos();
