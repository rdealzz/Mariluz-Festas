/* =========================================================
   Mariluz Festas — interações e direção de scroll
   GSAP + ScrollTrigger + SplitText + Lenis (hospedados em assets/vendor)
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var WA = '5541996865017';

  if (reduced) root.classList.add('reduced');
  if (!hasGsap) root.classList.add('no-gsap');

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Depoimentos (ilustrativos: trocar pelos reais) ---------- */
  var TESTIMONIALS = [
    { nome: 'Cliente Mariluz', evento: 'Chá de bebê', texto: 'Cada detalhe estava exatamente como sonhei. As flores, as cores e o arco de balões deixaram tudo delicado e elegante.' },
    { nome: 'Cliente Mariluz', evento: 'Aniversário infantil', texto: 'Meu filho ficou encantado com a mesa do tema. Atendimento carinhoso do começo ao fim e montagem impecável.' },
    { nome: 'Cliente Mariluz', evento: 'Casamento', texto: 'O muro inglês e as mesas espelhadas transformaram o salão. Os convidados não paravam de elogiar.' },
    { nome: 'Cliente Mariluz', evento: '15 anos', texto: 'O cenário das fotos ficou lindo. Pontualidade na montagem e muito cuidado com cada peça.' },
    { nome: 'Cliente Mariluz', evento: 'Evento corporativo', texto: 'Sofisticação e organização. Entenderam a nossa marca e entregaram uma composição de alto nível.' },
    { nome: 'Cliente Mariluz', evento: 'Aniversário adulto', texto: 'Acervo enorme e muito bem cuidado. Dá gosto visitar o showroom e escolher peça por peça.' }
  ];
  var rows = $('[data-testimonials]');
  if (rows) {
    var card = function (t) {
      var initials = t.nome.split(' ').map(function (p) { return p[0]; }).slice(0, 2).join('');
      var f = document.createElement('figure');
      f.className = 'quote';
      f.innerHTML = '<span class="stars" aria-label="5 de 5 estrelas">★★★★★</span><blockquote></blockquote><figcaption><span class="avatar" aria-hidden="true"></span><span><b></b><span></span></span></figcaption>';
      $('blockquote', f).textContent = '“' + t.texto + '”';
      $('.avatar', f).textContent = initials;
      $('figcaption b', f).textContent = t.nome;
      $('figcaption span span', f).textContent = t.evento;
      return f;
    };
    [TESTIMONIALS, TESTIMONIALS.slice().reverse()].forEach(function (list, i) {
      var row = document.createElement('div');
      row.className = 'row' + (i ? ' rev' : '');
      row.style.setProperty('--dur', (i ? 84 : 72) + 's');
      list.concat(list).forEach(function (t, k) {
        var c = card(t);
        if (k >= list.length) c.setAttribute('aria-hidden', 'true');
        row.appendChild(c);
      });
      rows.appendChild(row);
    });
  }

  /* ---------- Menu mobile ---------- */
  var toggle = $('.nav-toggle'), sheet = $('#sheet');
  var setMenu = function (open) {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    sheet.setAttribute('aria-hidden', !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  toggle.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
  $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); toggle.focus(); } });

  /* ---------- Rolagem suave ---------- */
  var lenis = null;
  if (hasGsap && !reduced && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.25, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var target = id.length > 1 ? $(id) : null;
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: id === '#inicio' ? 0 : -20, duration: 1.6 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
      if (target.tabIndex < 0 && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
      setTimeout(function () { target.focus({ preventScroll: true }); }, lenis ? 900 : 0);
    });
  });

  /* ---------- Botões: luz que segue o cursor, ímã e ripple ---------- */
  $$('.btn').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.setProperty('--x', (e.clientX - r.left) + 'px');
      b.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
    b.addEventListener('pointerdown', function (e) {
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2;
      var rp = document.createElement('span');
      rp.className = 'ripple';
      rp.style.cssText = 'left:' + (e.clientX - r.left) + 'px;top:' + (e.clientY - r.top) + 'px;width:' + s + 'px;height:' + s + 'px';
      b.appendChild(rp);
      if (hasGsap) gsap.to(rp, { scale: 1, opacity: 0, duration: 1.1, ease: 'power3.out', onComplete: function () { rp.remove(); } });
      else setTimeout(function () { rp.remove(); }, 400);
    });
  });
  if (hasGsap && finePointer && !reduced) {
    $$('[data-magnetic]').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: .8, ease: 'elastic.out(1, .45)' });
      var yTo = gsap.quickTo(el, 'y', { duration: .8, ease: 'elastic.out(1, .45)' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .22);
        yTo((e.clientY - r.top - r.height / 2) * .3);
      });
      el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ---------- Inclinação 3D com reflexo (cards, molduras de vidro, fotos) ---------- */
  if (finePointer && !reduced) {
    var tilt = function (el, max) {
      var raf = 0, tx = 0, ty = 0, cx = 0, cy = 0, mx = 50, my = 50, active = false;
      var loop = function () {
        cx += (tx - cx) * .12; cy += (ty - cy) * .12;
        el.style.setProperty('--rx', cy.toFixed(2) + 'deg');
        el.style.setProperty('--ry', cx.toFixed(2) + 'deg');
        el.style.setProperty('--mx', mx + '%');
        el.style.setProperty('--my', my + '%');
        if (active || Math.abs(tx - cx) > .02 || Math.abs(ty - cy) > .02) raf = requestAnimationFrame(loop); else raf = 0;
      };
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        tx = (px - .5) * max * 2; ty = (.5 - py) * max * 2; mx = (px * 100).toFixed(1); my = (py * 100).toFixed(1);
        active = true; if (!raf) raf = requestAnimationFrame(loop);
      });
      el.addEventListener('pointerleave', function () { tx = 0; ty = 0; active = false; if (!raf) raf = requestAnimationFrame(loop); });
    };
    $$('[data-tilt]').forEach(function (el) { tilt(el, +el.dataset.tilt || 6); });
    $$('[data-tile]').forEach(function (el) { tilt(el, 4); });

    /* Cursor */
    var cur = $('.cursor');
    if (hasGsap) {
      var cx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3.out' });
      var cy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3.out' });
      window.addEventListener('pointermove', function (e) { cur.classList.add('is-on'); cx(e.clientX); cy(e.clientY); }, { passive: true });
      document.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); });
      $$('a, button, [data-tile], select, input, textarea').forEach(function (el) {
        el.addEventListener('pointerenter', function () { cur.classList.add('is-hover'); });
        el.addEventListener('pointerleave', function () { cur.classList.remove('is-hover'); });
      });
    }
  }

  /* ---------- Hero: sequência de decorações ---------- */
  var SLIDES = [
    { title: 'Oh Baby', cat: 'Chá de bebê' },
    { title: 'Praia e surf', cat: 'Infantil' },
    { title: 'Batman', cat: 'Infantil' }
  ];
  var frameImgs = $$('.hero-frame img'), fbImgs = $$('.hero-fallback img'), dots = $$('.hero-dots button');
  var cap = $('[data-hero-caption]'), capCat = $('[data-hero-cat]');
  var slide = 0, slideTimer = null, SLIDE_MS = 6500;
  var goTo = function (i) {
    slide = (i + SLIDES.length) % SLIDES.length;
    frameImgs.forEach(function (im, k) { im.classList.toggle('is-on', k === slide); });
    fbImgs.forEach(function (im, k) { im.classList.toggle('is-on', k === slide); });
    dots.forEach(function (d, k) {
      d.setAttribute('aria-selected', k === slide);
      var bar = d.firstElementChild;
      if (hasGsap) {
        gsap.killTweensOf(bar);
        if (k < slide) gsap.set(bar, { scaleX: 1 });
        else if (k > slide) gsap.set(bar, { scaleX: 0 });
        else gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: reduced ? 0 : SLIDE_MS / 1000, ease: 'none' });
      }
    });
    if (cap) { cap.textContent = SLIDES[slide].title; capCat.textContent = SLIDES[slide].cat; }
    window.dispatchEvent(new CustomEvent('hero:goto', { detail: { index: slide } }));
  };
  var play = function () {
    clearInterval(slideTimer);
    if (!reduced) slideTimer = setInterval(function () { goTo(slide + 1); }, SLIDE_MS);
  };
  dots.forEach(function (d, k) { d.addEventListener('click', function () { goTo(k); play(); }); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(slideTimer); else play(); });

  /* Vídeo opcional do hero: só entra se o arquivo existir */
  var video = $('.hero-video');
  if (video && video.dataset.src && !reduced && !(navigator.connection && navigator.connection.saveData)) {
    var src = video.dataset.src;
    fetch(src, { method: 'HEAD' }).then(function (r) {
      if (!r.ok || !/video/.test(r.headers.get('content-type') || '')) return;
      video.src = src;
      video.addEventListener('canplay', function () { $('.hero').classList.add('has-video'); video.play().catch(function () {}); }, { once: true });
      video.load();
    }).catch(function () {});
  }

  /* ---------- Horário: aberto agora? ---------- */
  var openEl = $('[data-open]');
  try {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.filter(function (p) { return p.type === t; })[0] || {}).value; };
    var day = get('weekday'), mins = (+get('hour') % 24) * 60 + +get('minute');
    var weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(day) > -1;
    if (weekday) {
      var open = (mins >= 540 && mins < 720) || (mins >= 780 && mins < 1080);
      var lunch = mins >= 720 && mins < 780;
      openEl.textContent = open ? 'Aberto agora · até 18h' : lunch ? 'Pausa para almoço · volta às 13h' : 'Fechado agora · seg a sex, 9h às 18h';
      openEl.style.setProperty('--dot', open ? '#6E9C7A' : '#B4574A');
    } else if (day === 'Sat') {
      openEl.textContent = mins >= 540 ? 'Sábado · aberto a partir das 9h' : 'Abre hoje às 9h';
      openEl.style.setProperty('--dot', mins >= 540 ? '#6E9C7A' : '#B89A64');
    } else {
      openEl.textContent = 'Fechado hoje · seg a sex, 9h às 18h';
      openEl.style.setProperty('--dot', '#B4574A');
    }
  } catch (e) { /* mantém o texto padrão */ }

  /* ---------- Portfólio: abas ---------- */
  var THEMES = {
    casamentos: { bg: '#F4EFE7', fg: '#141415', acc: '#B89A64', dark: false },
    quinze: { bg: '#EFE5E0', fg: '#141415', acc: '#A7867B', dark: false },
    infantil: { bg: '#E9EDEE', fg: '#141415', acc: '#7F8E92', dark: false },
    corporativo: { bg: '#2A2A2C', fg: '#FFFFFF', acc: '#C9B48C', dark: true },
    formaturas: { bg: '#111112', fg: '#FFFFFF', acc: '#B89A64', dark: true },
    adultos: { bg: '#E6DED3', fg: '#141415', acc: '#8C7A64', dark: false }
  };
  var portfolio = $('.portfolio'), tabs = $$('.tab'), pill = $('.tab-pill');
  var placePill = function (tab, instant) {
    if (!pill || !tab) return;
    if (instant) pill.style.transition = 'none';
    pill.style.width = tab.offsetWidth + 'px';
    pill.style.transform = 'translate(' + tab.offsetLeft + 'px,' + (tab.offsetTop - 6) + 'px)';
    if (instant) { pill.offsetWidth; pill.style.transition = ''; }
  };
  var applyTheme = function (key) {
    var t = THEMES[key];
    portfolio.style.setProperty('--pbg', t.bg);
    portfolio.style.setProperty('--pink', t.fg);
    portfolio.style.setProperty('--pacc', t.acc);
    portfolio.classList.toggle('on-dark', t.dark);
    portfolio.classList.toggle('is-dark', t.dark);
    $$('.panel .btn', portfolio).forEach(function (b) { b.classList.toggle('btn-light', t.dark); b.classList.toggle('btn-dark', !t.dark); });
    updateNavTheme();
  };
  var selectTab = function (tab, focus) {
    var prev = $('.panel:not([hidden])', portfolio), next = $('#' + tab.getAttribute('aria-controls'));
    tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    placePill(tab);
    if (focus) tab.focus();
    applyTheme(tab.dataset.theme);
    if (prev === next) return;
    var show = function () {
      if (prev) prev.hidden = true;
      next.hidden = false;
      if (hasGsap && !reduced) {
        var word = $('.panel-word', next), rest = $$('.panel-num, .panel-text, .panel-list li, .panel .btn', next).filter(function (el) { return next.contains(el); });
        gsap.fromTo(word, { yPercent: 40, opacity: 0, filter: 'blur(12px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'lux' });
        gsap.fromTo(rest, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .05, delay: .15, ease: 'lux' });
        gsap.fromTo($('.panel-visual', next), { opacity: 0, scale: .94, rotateY: -8, y: 30 }, { opacity: 1, scale: 1, rotateY: 0, y: 0, duration: 1.4, ease: 'lux' });
      }
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };
    if (hasGsap && !reduced && prev) {
      gsap.to(prev, { opacity: 0, y: -16, duration: .45, ease: 'power2.in', onComplete: function () { gsap.set(prev, { opacity: 1, y: 0 }); show(); } });
    } else show();
  };
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });
  var initialTab = $('.tab[aria-selected="true"]');
  window.addEventListener('load', function () { placePill(initialTab, true); });
  window.addEventListener('resize', function () { placePill($('.tab[aria-selected="true"]'), true); });
  placePill(initialTab, true);

  /* ---------- Formulário ---------- */
  var form = $('.form'), status = $('#form-status');
  var select = form.elements.evento;
  var markSelect = function () { select.classList.toggle('has-value', !!select.value); };
  select.addEventListener('change', markSelect);
  $$('[data-evento]').forEach(function (a) {
    a.addEventListener('click', function () {
      for (var i = 0; i < select.options.length; i++) if (select.options[i].text === a.dataset.evento) select.selectedIndex = i;
      markSelect(); validate(select);
    });
  });
  var tel = form.elements.telefone;
  tel.addEventListener('input', function () {
    var d = tel.value.replace(/\D/g, '').slice(0, 11), o = d;
    if (d.length > 2) o = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 7) o = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
    tel.value = o;
  });
  var d0 = new Date(); form.elements.data.min = new Date(d0.getTime() - d0.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  var rules = {
    nome: function (v) { return v.trim().length >= 2; },
    telefone: function (v) { return v.replace(/\D/g, '').length >= 10; },
    evento: function (v) { return !!v; }
  };
  var validate = function (el) {
    var rule = rules[el.name]; if (!rule) return true;
    var ok = rule(el.value), f = el.closest('.field');
    f.classList.toggle('is-invalid', !ok);
    f.classList.toggle('is-valid', ok);
    el.setAttribute('aria-invalid', !ok);
    return ok;
  };
  Object.keys(rules).forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener('blur', function () { if (el.value) validate(el); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-invalid')) validate(el); });
    el.addEventListener('change', function () { validate(el); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = Object.keys(rules).map(function (n) { return form.elements[n]; }).filter(function (el) { return !validate(el); });
    if (bad.length) {
      status.textContent = 'Revise os campos destacados, por favor.';
      bad[0].focus();
      if (hasGsap && !reduced) gsap.fromTo(bad[0].closest('.field'), { x: -8 }, { x: 0, duration: .6, ease: 'elastic.out(1, .3)' });
      return;
    }
    var f = form.elements;
    var data = f.data.value ? f.data.value.split('-').reverse().join('/') : 'a definir';
    var lines = ['Olá, Mariluz! Vim pelo site e gostaria de solicitar um projeto.', '', '*Nome:* ' + f.nome.value.trim(), '*WhatsApp:* ' + f.telefone.value, '*Evento:* ' + f.evento.value, '*Data:* ' + data];
    if (f.convidados.value) lines.push('*Convidados:* ' + f.convidados.value);
    if (f.local.value.trim()) lines.push('*Local:* ' + f.local.value.trim());
    if (f.mensagem.value.trim()) lines.push('', f.mensagem.value.trim());
    status.textContent = 'Abrindo o WhatsApp com a sua mensagem…';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });

  /* ---------- Galeria: visualizador em tela cheia ---------- */
  var tiles = $$('[data-tile]'), viewer = $('.viewer'), vBg = $('.viewer-bg'), vUi = $('.viewer-ui');
  var vTitle = $('[data-v-title]'), vCat = $('[data-v-cat]'), vIndex = 0, vImg = null, vOrigin = null;
  var fitRect = function (img) {
    var vw = window.innerWidth, vh = window.innerHeight, pad = vw < 700 ? 16 : 96, top = vw < 700 ? 90 : 90, bottom = vw < 700 ? 110 : 60;
    var ar = img.naturalWidth / img.naturalHeight || 1, w = vw - pad * 2, h = w / ar;
    if (h > vh - top - bottom) { h = vh - top - bottom; w = h * ar; }
    return { left: (vw - w) / 2, top: top + (vh - top - bottom - h) / 2, width: w, height: h };
  };
  var setRect = function (el, r) { el.style.left = r.left + 'px'; el.style.top = r.top + 'px'; el.style.width = r.width + 'px'; el.style.height = r.height + 'px'; };
  var openViewer = function (i) {
    vIndex = i; vOrigin = tiles[i];
    var src = $('img', vOrigin), from = src.getBoundingClientRect();
    vImg = document.createElement('img');
    vImg.className = 'viewer-img'; vImg.src = src.currentSrc || src.src; vImg.alt = src.alt;
    viewer.appendChild(vImg);
    vTitle.textContent = vOrigin.dataset.title; vCat.textContent = vOrigin.dataset.cat;
    viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop(); document.body.style.overflow = 'hidden';
    var to = fitRect(src);
    if (hasGsap && !reduced) {
      setRect(vImg, from);
      gsap.set(vImg, { borderRadius: 22 });
      src.style.visibility = 'hidden';
      gsap.to(vBg, { opacity: 1, duration: .7, ease: 'power2.out' });
      gsap.to(vImg, { left: to.left, top: to.top, width: to.width, height: to.height, borderRadius: 18, duration: 1, ease: 'lux' });
      gsap.to(vUi, { opacity: 1, duration: .6, delay: .35 });
    } else {
      setRect(vImg, to); vBg.style.opacity = 1; vUi.style.opacity = 1;
    }
    $('[data-v-close]').focus();
  };
  var swap = function (dir) {
    vIndex = (vIndex + dir + tiles.length) % tiles.length;
    $('img', vOrigin).style.visibility = '';
    vOrigin = tiles[vIndex];
    var src = $('img', vOrigin), next = vImg;
    vTitle.textContent = vOrigin.dataset.title; vCat.textContent = vOrigin.dataset.cat;
    var apply = function () { next.src = src.currentSrc || src.src; next.alt = src.alt; setRect(next, fitRect(src)); src.style.visibility = 'hidden'; };
    if (hasGsap && !reduced) {
      gsap.to(next, { opacity: 0, x: -40 * dir, scale: .96, duration: .35, ease: 'power2.in', onComplete: function () {
        apply(); gsap.fromTo(next, { opacity: 0, x: 40 * dir, scale: .96 }, { opacity: 1, x: 0, scale: 1, duration: .8, ease: 'lux' });
      } });
    } else apply();
  };
  var closeViewer = function () {
    if (!vImg) return;
    var src = $('img', vOrigin), img = vImg, origin = vOrigin;
    var done = function () {
      img.remove(); src.style.visibility = ''; viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden', 'true');
      vBg.style.opacity = 0; vUi.style.opacity = 0; if (lenis) lenis.start(); document.body.style.overflow = ''; origin.focus({ preventScroll: true });
    };
    vImg = null;
    if (hasGsap && !reduced) {
      var r = src.getBoundingClientRect();
      gsap.to(vUi, { opacity: 0, duration: .25 });
      gsap.to(vBg, { opacity: 0, duration: .7, delay: .1 });
      gsap.to(img, { left: r.left, top: r.top, width: r.width, height: r.height, borderRadius: 22, x: 0, duration: .85, ease: 'lux', onComplete: done });
    } else done();
  };
  tiles.forEach(function (t, i) { t.addEventListener('click', function () { openViewer(i); }); });
  $('[data-v-close]').addEventListener('click', closeViewer);
  $('[data-v-prev]').addEventListener('click', function () { swap(-1); });
  $('[data-v-next]').addEventListener('click', function () { swap(1); });
  vBg.addEventListener('click', closeViewer);
  document.addEventListener('keydown', function (e) {
    if (!viewer.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowRight') swap(1);
    if (e.key === 'ArrowLeft') swap(-1);
    if (e.key === 'Tab') { /* mantém o foco dentro do visualizador */
      var f = $$('button', viewer), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var tsx = 0;
  viewer.addEventListener('touchstart', function (e) { tsx = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - tsx; if (Math.abs(dx) > 50) swap(dx < 0 ? 1 : -1); }, { passive: true });
  window.addEventListener('resize', function () { if (vImg) setRect(vImg, fitRect($('img', vOrigin))); });

  /* ---------- Menu: tema e compactação ---------- */
  var nav = $('[data-nav]'), navThemeSections = $$('[data-nav-theme]');
  function updateNavTheme() {
    var probe = 40, theme = 'dark';
    for (var i = 0; i < navThemeSections.length; i++) {
      var r = navThemeSections[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) {
        theme = navThemeSections[i].dataset.navTheme;
        if (navThemeSections[i] === portfolio && portfolio.classList.contains('on-dark')) theme = 'dark';
        break;
      }
    }
    nav.classList.toggle('is-light', theme === 'light');
    nav.classList.toggle('is-compact', window.scrollY > 80);
  }
  var navLinks = $$('.nav-links a');
  var updateCurrent = function () {
    var mid = window.innerHeight * .4, current = null;
    navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) { var r = s.getBoundingClientRect(); if (r.top < mid && r.bottom > mid) current = a; } });
    navLinks.forEach(function (a) { a.setAttribute('aria-current', a === current); });
  };
  var orb = $('.orb');
  if (!hasGsap) orb.classList.add('is-on');
  var onScroll = function () { updateNavTheme(); updateCurrent(); };
  if (lenis) lenis.on('scroll', onScroll); else window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* =========================================================
     Direção de cena (GSAP)
     ========================================================= */
  if (!hasGsap) { $('.loader') && $('.loader').remove(); goTo(0); play(); return; }

  gsap.registerPlugin(ScrollTrigger, CustomEase);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  CustomEase.create('lux', '0.22, 1, 0.36, 1');
  CustomEase.create('silk', '0.65, 0, 0.35, 1');
  gsap.defaults({ ease: 'lux' });

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  var fontsReady = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1500); })]) : Promise.resolve();
  fontsReady.then(scene);
  function scene() {
  /* Abertura + entrada do hero */
  var heroTitle = $('[data-split-hero]');
  var split = (window.SplitText && !reduced) ? new SplitText(heroTitle, { type: 'lines,words', linesClass: 'split-line', mask: 'lines' }) : null;
  var intro = gsap.timeline({ delay: .1 });
  if (!reduced) {
    intro
      .to('.loader-word', { opacity: 1, letterSpacing: '.72em', duration: 1.1, ease: 'silk' })
      .to('.loader-bar span', { scaleX: 1, duration: 1, ease: 'silk' }, '<.1')
      .to('.loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=.1')
      .set('.loader', { display: 'none' })
      .from('.hero-media', { scale: 1.12, duration: 2.4, ease: 'expo.out' }, '-=.7');
    if (split) intro.from(split.words, { yPercent: 110, opacity: 0, filter: 'blur(8px)', duration: 1.4, stagger: .045 }, '-=2');
    intro
      .from('[data-hero-in]', { y: 30, opacity: 0, duration: 1.2, stagger: .1 }, '-=1.1')
      .from(nav, { y: -30, opacity: 0, duration: 1.2 }, '<');
  } else {
    $('.loader').remove();
  }
  intro.add(function () { goTo(0); play(); if (split) split.revert(); /* devolve o texto ao fluxo normal para acompanhar redimensionamentos */ });

  /* Hero ao rolar: profundidade */
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero-copy', { yPercent: -18, opacity: 0, ease: 'none' }, 0)
    .to('.hero-frame-wrap', { yPercent: -30, ease: 'none' }, 0)
    .to('.hero-media', { scale: 1.12, yPercent: 10, ease: 'none' }, 0)
    .to('.hero-bottom', { opacity: 0, ease: 'none' }, 0);

  /* Títulos: linha a linha */
  if (window.SplitText && !reduced) {
    $$('.title').forEach(function (t) {
      t.removeAttribute('data-reveal'); t.style.opacity = 1;
      var s = new SplitText(t, { type: 'lines', linesClass: 'split-line', mask: 'lines' });
      gsap.from(s.lines, { yPercent: 105, duration: 1.3, stagger: .1, onComplete: function () { s.revert(); }, scrollTrigger: { trigger: t, start: 'top 85%', once: true } });
    });
  }

  /* Entradas genéricas */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: function (els) { gsap.fromTo(els, { y: 40, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, stagger: .08, clearProps: 'filter' }); }
  });

  /* Manifesto: palavras acendem com o scroll */
  var mt = $('[data-words]');
  if (mt && window.SplitText && !reduced) {
    var ms = new SplitText(mt, { type: 'words', wordsClass: 'w' });
    gsap.to(ms.words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: mt, start: 'top 75%', end: 'bottom 45%', scrub: .6 } });
  }

  /* Galeria: entrada em cascata + parallax interno */
  gsap.set('[data-tile]', { opacity: 0, y: 80, scale: .96 });
  ScrollTrigger.batch('[data-tile]', {
    start: 'top 92%', once: true,
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, scale: 1, duration: 1.4, stagger: .12 }); }
  });
  if (!reduced) {
    $$('[data-tile] .tile-media').forEach(function (m) {
      gsap.fromTo($('img', m), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* Processo: linha desenhada e etapas ativas */
  gsap.to('.timeline-line span', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 60%', end: 'bottom 60%', scrub: .5 } });
  $$('.step').forEach(function (s, i) {
    var cardEl = $('.step-card', s), fromX = window.innerWidth > 820 ? (i % 2 ? -60 : 60) : 30;
    gsap.from(cardEl, { x: fromX, opacity: 0, rotateY: i % 2 ? 8 : -8, duration: 1.3, scrollTrigger: { trigger: s, start: 'top 82%', once: true } });
    ScrollTrigger.create({ trigger: s, start: 'top 60%', end: 'bottom 60%', toggleClass: { targets: s, className: 'is-active' } });
  });

  /* Diferenciais: flutuação sutil ao rolar */
  if (!reduced) {
    $$('.card').forEach(function (c, i) {
      gsap.fromTo(c, { y: 30 + (i % 3) * 20 }, { y: -(10 + (i % 3) * 14), ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
  }

  /* Números: contagem */
  var fmt = function (v, dec) { return v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
  $$('[data-count]').forEach(function (el) {
    var target = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), o = { v: 0 };
    el.textContent = fmt(0, dec);
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () {
      gsap.to(o, { v: target, duration: reduced ? 0 : 2.4, ease: 'expo.out', onUpdate: function () { el.textContent = fmt(o.v, dec); } });
    } });
  });

  /* Ambiente: a luz muda conforme a seção */
  var ambientTones = [
    { sel: '#portfolio', c1: '#EDE3D2', c2: '#E4E8EA' },
    { sel: '#galeria', c1: '#F1E9DC', c2: '#EEF0F1' },
    { sel: '#processo', c1: '#EEF0F1', c2: '#EFE6D6' },
    { sel: '#diferenciais', c1: '#E9DDC8', c2: '#F3F1EC' },
    { sel: '#contato', c1: '#E9DDC8', c2: '#EFE7DC' }
  ];
  ambientTones.forEach(function (t) {
    ScrollTrigger.create({ trigger: t.sel, start: 'top 60%', end: 'bottom 40%', onToggle: function (st) {
      if (!st.isActive) return;
      gsap.to('.ambient .a1', { background: 'radial-gradient(circle, ' + t.c1 + ', transparent 65%)', duration: 2 });
      gsap.to('.ambient .a2', { background: 'radial-gradient(circle, ' + t.c2 + ', transparent 65%)', duration: 2 });
    } });
  });

  /* Mapa: zoom cinematográfico */
  var mapShell = $('[data-map]');
  if (mapShell && !reduced) {
    gsap.fromTo($('iframe', mapShell), { scale: 1.45, filter: 'grayscale(1) blur(6px) brightness(1.1)' }, { scale: 1, filter: 'grayscale(1) blur(0px) brightness(1.04)', ease: 'none', scrollTrigger: { trigger: mapShell, start: 'top 95%', end: 'center 55%', scrub: 1 } });
    gsap.from('.map-card', { y: 60, opacity: 0, duration: 1.4, scrollTrigger: { trigger: mapShell, start: 'top 55%', once: true } });
    gsap.from('.map-pin', { scale: 0, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: mapShell, start: 'top 50%', once: true } });
  }

  /* Rodapé: palavra final em parallax */
  if (!reduced) gsap.from('.footer-word', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });

  /* Esfera do WhatsApp surge após o hero */
  ScrollTrigger.create({ trigger: '.hero', start: 'bottom 70%', onEnter: function () { orb.classList.add('is-on'); }, onLeaveBack: function () { orb.classList.remove('is-on'); } });

  ScrollTrigger.refresh();
  placePill($('.tab[aria-selected="true"]'), true);
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
