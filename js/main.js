/* ============================================================
   MELGAR & ASOCIADOS — Interacciones
   Todas las animaciones manipulan clases; el movimiento real
   se resuelve en CSS con transform/opacity.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabecera: estado al hacer scroll ---------- */
  var header = $('.site-header');
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        header.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = $('.menu-toggle');
  var body = document.body;
  function closeMenu() {
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }
  toggle.addEventListener('click', function () {
    var open = body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('.main-nav a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  /* ---------- Submenú de áreas de práctica ---------- */
  var submenus = $$('.has-submenu');
  function closeSubmenus(except) {
    submenus.forEach(function (item) {
      if (item !== except) {
        item.classList.remove('open');
        $('.submenu-toggle', item).setAttribute('aria-expanded', 'false');
      }
    });
  }
  submenus.forEach(function (item) {
    var btn = $('.submenu-toggle', item);
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      closeSubmenus(item);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-submenu')) closeSubmenus(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSubmenus(null);
  });

  /* ---------- Animaciones de entrada (IntersectionObserver) ---------- */
  var reveals = $$('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Contadores del hero ---------- */
  var counters = $$('.counter');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    function format(value) {
      return value.toLocaleString('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
    if (reducedMotion) { el.textContent = format(target); return; }
    var factor = Math.pow(10, decimals);
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(Math.round(target * eased * factor) / factor);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var ioCount = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          ioCount.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { ioCount.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Slider de testimonios ---------- */
  var slider = $('.slider');
  if (slider) {
    var track = $('.slider-track', slider);
    var slides = $$('.testimonial', slider);
    var dotsWrap = $('.slider-dots', slider);
    var current = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Testimonio ' + (i + 1) + ' de ' + slides.length);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () { goTo(i, true); });
      dotsWrap.appendChild(dot);
    });
    var dots = $$('.slider-dot', slider);

    function goTo(index, manual) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      slides.forEach(function (s, i) { s.setAttribute('aria-hidden', String(i !== current)); });
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', String(i === current)); });
      if (manual) restartAuto();
    }

    $$('.slider-btn', slider).forEach(function (btn) {
      btn.addEventListener('click', function () {
        goTo(current + parseInt(btn.getAttribute('data-dir'), 10), true);
      });
    });

    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') goTo(current - 1, true);
      if (e.key === 'ArrowRight') goTo(current + 1, true);
    });

    function startAuto() {
      if (reducedMotion) return;
      timer = window.setInterval(function () { goTo(current + 1); }, 7000);
    }
    function stopAuto() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restartAuto() { stopAuto(); startAuto(); }
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);
    startAuto();
  }

  /* ---------- Formulario: validación + honeypot ---------- */
  var form = $('#form-contacto');
  if (form) {
    var status = $('.form-status', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Honeypot: si el campo oculto llega relleno es un bot.
         Se simula éxito y se descarta en silencio (no dar pistas). */
      if (form.elements.sitio_web.value !== '') {
        status.textContent = 'Gracias, su consulta ha sido enviada.';
        status.className = 'form-status ok';
        form.reset();
        return;
      }

      var valid = true;
      $$('[required]', form).forEach(function (field) {
        var empty = field.type === 'checkbox' ? !field.checked : field.value.trim() === '';
        field.setAttribute('aria-invalid', String(empty));
        if (empty) valid = false;
      });

      if (!valid) {
        status.textContent = 'Revise los campos marcados: faltan datos obligatorios.';
        status.className = 'form-status error';
        return;
      }

      /* TODO: sustituir por el envío real al servidor (fetch al endpoint
         del despacho). El servidor debe repetir la validación, comprobar
         el honeypot y registrar fecha y texto del consentimiento. */
      var btn = $('.btn-submit', form);
      btn.disabled = true;
      status.textContent = 'Enviando…';
      status.className = 'form-status';
      window.setTimeout(function () {
        btn.disabled = false;
        form.reset();
        status.textContent = 'Gracias. Hemos recibido su consulta y le responderemos en menos de 24 horas laborables.';
        status.className = 'form-status ok';
      }, 900);
    });

    $$('[required]', form).forEach(function (field) {
      field.addEventListener('input', function () { field.removeAttribute('aria-invalid'); });
      field.addEventListener('change', function () { field.removeAttribute('aria-invalid'); });
    });
  }

  /* ---------- Mapa de Google bajo demanda ----------
     El iframe no se inserta hasta que el usuario lo pide: así ninguna
     visita genera peticiones ni cookies de Google sin su intervención. */
  var mapBox = $('#mapa-despacho');
  var mapBtn = $('#cargar-mapa');
  if (mapBox && mapBtn) {
    mapBtn.addEventListener('click', function () {
      var src = mapBox.getAttribute('data-map-src');
      if (!src) return;
      var frame = document.createElement('iframe');
      frame.src = src;
      frame.title = 'Mapa con la ubicación del despacho Melgar & Asociados';
      frame.loading = 'lazy';
      frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      frame.setAttribute('allowfullscreen', '');
      mapBox.innerHTML = '';
      mapBox.appendChild(frame);
    });
  }

  /* ---------- Banner de cookies + Consent Mode v2 ---------- */
  var banner = $('#cookie-banner');
  var KEY = 'ma-consent-v1';

  function applyConsent(granted) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied'
      });
    }
  }

  function showBanner() {
    banner.hidden = false;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { banner.classList.add('visible'); });
    });
  }
  function hideBanner() {
    banner.classList.remove('visible');
    window.setTimeout(function () { banner.hidden = true; }, 500);
  }
  function decide(granted) {
    try { window.localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch (err) { /* modo privado */ }
    applyConsent(granted);
    hideBanner();
  }

  var saved = null;
  try { saved = window.localStorage.getItem(KEY); } catch (err) { /* modo privado */ }
  if (saved === 'granted') {
    applyConsent(true);
  } else if (saved === 'denied') {
    applyConsent(false);
  } else {
    window.setTimeout(showBanner, 1200);
  }

  $('#cookies-aceptar').addEventListener('click', function () { decide(true); });
  $('#cookies-rechazar').addEventListener('click', function () { decide(false); });

  var manage = $('#gestionar-cookies');
  if (manage) {
    manage.addEventListener('click', function () {
      try { window.localStorage.removeItem(KEY); } catch (err) { /* modo privado */ }
      showBanner();
      banner.scrollIntoView({ block: 'end', behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Año del pie ---------- */
  var anio = $('#anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
