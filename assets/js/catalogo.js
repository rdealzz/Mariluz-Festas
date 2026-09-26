/* =========================================================
   Mariluz Festas — catálogo de locação e lista de orçamento
   Carregado antes de main.js: os cards já existem quando os
   efeitos de botão e cursor são ligados.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var WA = '5541996865017';
  var STORE = 'mariluz-lista';

  /* ---------- Catálogo: edite aqui ----------
     img: foto em assets/img (opcional). Sem foto, o card usa a ilustração em "art".
     badge: selo opcional ("Mais procurado").
     tag: como a peça sai da loja. */
  var CATEGORIES = [
    { id: 'kits', label: 'Kits temáticos' },
    { id: 'doces', label: 'Suportes para doces' },
    { id: 'moveis', label: 'Mesas e painéis' },
    { id: 'baloes', label: 'Balões' }
  ];
  var PEGUE = 'Pegue e monte', MONTAGEM = 'Montagem no local';
  var CATALOG = [
    { id: 'kit-oh-baby', cat: 'kits', nome: 'Kit Oh Baby', desc: 'Chá de bebê em rosé, verde e dourado, com flores e arco de balões.', img: 'assets/img/tema-oh-baby.webp', tag: PEGUE, badge: 'Mais procurado' },
    { id: 'kit-futebol', cat: 'kits', nome: 'Kit Futebol', desc: 'Bola gigante, gramado e balões nas cores do time.', img: 'assets/img/tema-futebol.webp', tag: PEGUE, badge: 'Mais procurado' },
    { id: 'kit-batman', cat: 'kits', nome: 'Kit Batman', desc: 'Tonel, plantas e personagem para uma mesa marcante.', img: 'assets/img/tema-batman.webp', tag: PEGUE },
    { id: 'kit-praia', cat: 'kits', nome: 'Kit Praia e surf', desc: 'Prancha, remo e boia para uma festa leve e solar.', img: 'assets/img/tema-praia.webp', tag: PEGUE },
    { id: 'kit-fundo-do-mar', cat: 'kits', nome: 'Kit Fundo do mar', desc: 'Tons de azul e personagens do oceano.', img: 'assets/img/tema-fundo-do-mar.webp', tag: PEGUE },
    { id: 'kit-star-wars', cat: 'kits', nome: 'Kit Star Wars', desc: 'Personagens e peças da galáxia para os pequenos fãs.', img: 'assets/img/tema-star-wars.webp', tag: PEGUE },

    { id: 'suporte-colonial', cat: 'doces', nome: 'Suporte para doces pé colonial', desc: 'Branco e liso, em alturas variadas para compor a mesa.', art: 'stand', tag: PEGUE, badge: 'Mais procurado' },
    { id: 'trio-suportes', cat: 'doces', nome: 'Trio de suportes para doces', desc: 'Três alturas, ideal para mesas pequenas e composições enxutas.', art: 'trio', tag: PEGUE },
    { id: 'bandejas-espelhadas', cat: 'doces', nome: 'Bandejas espelhadas', desc: 'Reflexo delicado para doces finos e lembrancinhas.', art: 'tray', tag: PEGUE },
    { id: 'bolo-cenografico', cat: 'doces', nome: 'Bolo cenográfico', desc: 'Andares decorados para o centro da mesa e para as fotos.', art: 'cake', tag: PEGUE },

    { id: 'mesa-provencal', cat: 'moveis', nome: 'Mesa provençal', desc: 'Pés torneados e acabamento clássico, o centro da composição.', art: 'provencal', tag: PEGUE, badge: 'Mais procurado' },
    { id: 'mesa-espelhada', cat: 'moveis', nome: 'Mesa espelhada', desc: 'Linhas retas e brilho discreto para festas modernas.', art: 'mirror', tag: PEGUE },
    { id: 'trio-cilindros', cat: 'moveis', nome: 'Trio de cilindros', desc: 'Três alturas para apoiar o bolo, os doces e os personagens.', art: 'cylinders', tag: PEGUE },
    { id: 'painel-redondo', cat: 'moveis', nome: 'Painel redondo', desc: 'Fundo neutro que recebe balões, flores e o nome do homenageado.', art: 'round', tag: PEGUE },
    { id: 'muro-ingles', cat: 'moveis', nome: 'Muro inglês', desc: 'Parede verde para cenários de fotos e mini weddings.', art: 'hedge', tag: PEGUE },

    { id: 'arco-desconstruido', cat: 'baloes', nome: 'Arco de balões desconstruído', desc: 'Montado no local, nas cores da sua festa.', art: 'arch', tag: MONTAGEM, badge: 'Mais procurado' },
    { id: 'painel-com-baloes', cat: 'baloes', nome: 'Painel redondo com balões', desc: 'Painel com arranjo orgânico de balões, pronto para as fotos.', art: 'roundBalloons', tag: MONTAGEM },
    { id: 'coluna-baloes', cat: 'baloes', nome: 'Par de colunas de balões', desc: 'Para a entrada ou para emoldurar a mesa principal.', art: 'column', tag: MONTAGEM }
  ];

  /* ---------- Ilustrações em linha (peças ainda sem foto) ---------- */
  var circles = function (pts, cls) {
    return pts.map(function (p) { return '<circle class="' + (cls || 'b') + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + p[2] + '"/>'; }).join('');
  };
  var ART = {
    stand: '<ellipse class="f" cx="60" cy="52" rx="34" ry="6"/>' + circles([[46, 44, 5], [58, 42, 5.5], [71, 44, 5]], 'g') + '<path d="M56 58q-2 12 1 22M64 58q2 12-1 22"/><path class="f" d="M44 91q16-12 32 0z"/>',
    trio: [[30, 62], [60, 44], [90, 70]].map(function (s) {
      var x = s[0], y = s[1];
      return '<ellipse class="f" cx="' + x + '" cy="' + y + '" rx="15" ry="3.5"/>' + circles([[x - 6, y - 4, 3], [x + 1, y - 5, 3.2], [x + 7, y - 4, 3]], 'g') + '<path d="M' + (x - 2) + ' ' + (y + 3) + 'V91M' + (x + 2) + ' ' + (y + 3) + 'V91"/><path class="f" d="M' + (x - 9) + ' 94q9-7 18 0z"/>';
    }).join(''),
    tray: '<ellipse class="f" cx="60" cy="68" rx="42" ry="13"/><ellipse cx="60" cy="67" rx="33" ry="8.5"/><path class="soft" d="M36 72l10-9M46 74l10-10M74 73l8-7"/>' + circles([[44, 62, 4], [54, 60, 4.5], [65, 60, 4.5], [75, 62, 4]], 'g'),
    cake: '<path d="M24 94h72"/><rect class="f" x="34" y="70" width="52" height="24" rx="3"/><rect class="f" x="42" y="50" width="36" height="20" rx="3"/><rect class="f" x="50" y="34" width="20" height="16" rx="3"/><path class="soft" d="M34 76q6.5 5 13 0t13 0 13 0 13 0M42 55q6 4 12 0t12 0 12 0"/>' + circles([[60, 29, 4]], 'g'),
    provencal: '<rect class="f" x="18" y="44" width="84" height="8" rx="2"/><path class="f" d="M24 52h72q-6 12-36 12T24 52z"/><path d="M30 60c-5 12 4 20-2 34M90 60c5 12-4 20 2 34"/>' + circles([[60, 38, 5]], 'g'),
    mirror: '<rect class="f" x="24" y="40" width="72" height="52" rx="2"/><path d="M24 50h72"/><path class="soft" d="M36 86l14-30M48 86l14-30M70 86l10-22"/>',
    cylinders: [[34, 56], [60, 38], [86, 66]].map(function (c) {
      var x = c[0], y = c[1];
      return '<path class="f" d="M' + (x - 12) + ' ' + y + 'V94a12 3.5 0 0 0 24 0V' + y + '"/><ellipse class="f" cx="' + x + '" cy="' + y + '" rx="12" ry="3.5"/>';
    }).join(''),
    round: '<circle class="f" cx="60" cy="54" r="34"/><circle class="soft" cx="60" cy="54" r="27"/><path d="M46 85l-5 12M74 85l5 12M52 97h16"/>',
    hedge: '<rect class="f" x="26" y="24" width="68" height="70" rx="3"/>' + (function () {
      var p = [];
      for (var r = 0; r < 7; r++) for (var c = 0; c < 7; c++) p.push([32 + c * 9.3 + (r % 2 ? 4 : 0), 30 + r * 9.6, 2.2]);
      return circles(p.filter(function (q) { return q[0] < 90; }), 'leaf');
    })(),
    arch: (function () {
      var p = [], n = 12;
      for (var i = 0; i < n; i++) {
        var a = Math.PI - (Math.PI * i) / (n - 1), rr = [8, 6, 9, 6.5][i % 4];
        p.push([60 + Math.cos(a) * 36, 92 - Math.sin(a) * 52, rr]);
      }
      return circles(p) + circles([[33, 52, 3], [84, 46, 3.4], [70, 34, 2.6]], 'g');
    })(),
    roundBalloons: '<circle class="f" cx="62" cy="50" r="32"/><path d="M50 80l-4 16M74 80l4 16"/>' + circles([[34, 78, 8.5], [26, 66, 6], [44, 88, 6.5], [30, 90, 5], [22, 80, 4.5], [88, 26, 6], [96, 36, 4.5]]) + circles([[40, 70, 3]], 'g'),
    column: [38, 82].map(function (x) {
      var p = [];
      for (var k = 0; k < 6; k++) p.push([x + (k % 2 ? 3 : -3), 92 - k * 10, 6.5]);
      p.push([x, 26, 9]);
      return circles(p) + '<path d="M' + (x - 9) + ' 98h18"/>';
    }).join('')
  };
  var artSvg = function (key) { return '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' + (ART[key] || '') + '</svg>'; };
  var mediaHtml = function (p, small) {
    if (p.img) return '<img src="' + p.img + '" alt="' + (small ? '' : p.nome) + '" loading="lazy">';
    return '<div class="product-art" data-cat="' + p.cat + '">' + artSvg(p.art) + '</div>';
  };
  var byId = {};
  CATALOG.forEach(function (p) { byId[p.id] = p; });
  var catLabel = function (id) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].label; return ''; };
  var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };

  /* ---------- Lista (persistida só neste navegador) ---------- */
  var list = {};
  try { list = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { list = {}; }
  Object.keys(list).forEach(function (id) { if (!byId[id] || !(list[id] > 0)) delete list[id]; });
  var save = function () { try { localStorage.setItem(STORE, JSON.stringify(list)); } catch (e) { /* sem armazenamento: a lista vale só nesta visita */ } };
  var count = function () { return Object.keys(list).reduce(function (n, id) { return n + list[id]; }, 0); };
  var inList = function () { return CATALOG.filter(function (p) { return list[p.id]; }); };
  var lines = function () { return inList().map(function (p) { return list[p.id] + 'x ' + p.nome; }); };

  /* ---------- Mensagens para o WhatsApp: levam todos os dados da peça ---------- */
  var ref = function (p) { return p.id.toUpperCase(); };
  var absUrl = function (path) {
    if (!/^https?:$/.test(location.protocol)) return '';
    try { return new URL(path, location.href).href; } catch (e) { return ''; }
  };
  var photo = function (p) { return p.img ? absUrl(p.img) : ''; };
  /* Uma linha por peça, usada na lista e no formulário (main.js) */
  var detailLines = function () {
    return inList().map(function (p) {
      var l = list[p.id] + 'x ' + p.nome + ' · ' + catLabel(p.cat) + ' · ' + p.tag + ' · Ref. ' + ref(p);
      return photo(p) ? l + '\n   Foto: ' + photo(p) : l;
    });
  };
  var waUrl = function (lines) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')); };

  var live = document.createElement('div');
  live.className = 'sr-only'; live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  /* ---------- Cards ---------- */
  var grid = $('[data-products]'), chipsEl = $('[data-chips]'), countEl = $('[data-catalog-count]');
  if (!grid) return;
  var waIcon = '<svg class="i-wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.5L3.5 21l1.6-4.4A8.5 8.5 0 1 1 20.5 12z"/><path d="M9 9.2c.3 2.5 2.2 4.5 4.8 5l1-1 1.7.8c-.3 1-1.2 1.6-2.3 1.5-3.4-.4-6.1-3.1-6.5-6.5-.1-1.1.5-2 1.5-2.3l.8 1.7z"/></svg>';
  /* Pedido direto de uma peça: abre o WhatsApp já com o nome dela */
  var waLink = function (p) {
    var link = photo(p) || absUrl('#catalogo');
    var msg = ['Olá, Mariluz! Tudo bem? Vi a decoração *' + p.nome + '* no site e quero fazer o pedido de locação para a minha festa.'];
    if (link) msg.push(link);
    msg.push('',
      '*Produto:* ' + p.nome,
      '*Categoria:* ' + catLabel(p.cat),
      '*Descrição:* ' + p.desc,
      '*Modalidade:* ' + p.tag,
      '*Quantidade:* 1',
      '*Ref.:* ' + ref(p),
      '', '*Data da festa:* a definir',
      'Pode me confirmar valores e disponibilidade? Obrigada!');
    return waUrl(msg);
  };
  var plus = '<svg class="i-plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><svg class="i-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  CATALOG.forEach(function (p) {
    var li = document.createElement('li');
    li.className = 'product'; li.dataset.cat = p.cat; li.dataset.id = p.id;
    li.innerHTML =
      '<article>' +
        '<div class="product-media">' + mediaHtml(p) + (p.badge ? '<span class="product-badge">' + esc(p.badge) + '</span>' : '') + '</div>' +
        '<div class="product-body">' +
          '<span class="product-cat">' + esc(catLabel(p.cat)) + '</span>' +
          '<h3>' + esc(p.nome) + '</h3>' +
          '<p>' + esc(p.desc) + '</p>' +
          '<span class="product-tag">' + esc(p.tag) + '</span>' +
          '<div class="product-foot">' +
            '<a class="btn btn-dark btn-sm product-wa" href="' + waLink(p) + '" target="_blank" rel="noopener">' + waIcon + '<span class="long">Pedir no WhatsApp</span><span class="short">Pedir</span><span class="sr-only"> ' + esc(p.nome) + '</span></a>' +
            '<button type="button" class="product-add" aria-pressed="false" data-add="' + p.id + '" aria-label="Adicionar ' + esc(p.nome) + ' à lista" title="Adicionar à lista">' + plus + '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    grid.appendChild(li);
  });
  var cards = $$('.product', grid);

  /* Filtros */
  var active = 'all';
  var chipDefs = [{ id: 'all', label: 'Todos' }].concat(CATEGORIES);
  chipDefs.forEach(function (c) {
    var n = c.id === 'all' ? CATALOG.length : CATALOG.filter(function (p) { return p.cat === c.id; }).length;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.filter = c.id;
    b.setAttribute('aria-pressed', c.id === active);
    b.innerHTML = esc(c.label) + '<small>' + n + '</small>';
    chipsEl.appendChild(b);
  });
  var chips = $$('.chip', chipsEl);
  var setCount = function (n) { countEl.textContent = n + (n === 1 ? ' peça' : ' peças'); };
  setCount(CATALOG.length);

  var revealIn = function (els, stagger) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    if (!hasGsap || reduced) return;
    gsap.fromTo(els, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: stagger, ease: 'expo.out', clearProps: 'transform' });
  };
  var filter = function (id) {
    if (id === active) return;
    active = id;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.filter === id); });
    var shown = [];
    cards.forEach(function (c) {
      var on = id === 'all' || c.dataset.cat === id;
      c.hidden = !on;
      if (on) shown.push(c);
    });
    setCount(shown.length);
    revealIn(shown, .045);
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };
  chips.forEach(function (c) { c.addEventListener('click', function () { filter(c.dataset.filter); }); });

  /* Entrada dos cards ao rolar */
  if (hasGsap && !reduced && 'IntersectionObserver' in window) {
    grid.classList.add('is-animated');
    var queue = [], flush = 0;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (!e.target.classList.contains('is-in')) queue.push(e.target);
      });
      if (queue.length && !flush) flush = requestAnimationFrame(function () { revealIn(queue, .08); queue = []; flush = 0; });
    }, { rootMargin: '0px 0px -8% 0px' });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Lista: botão flutuante, painel e formulário ---------- */
  var bag = $('.bag'), bagCount = $('[data-bag-count]');
  var drawer = $('#drawer'), itemsEl = $('[data-drawer-items]'), emptyEl = $('[data-drawer-empty]');
  var sendBtn = $('[data-bag-send]'), formBtn = $('[data-bag-form]');
  var formList = $('[data-form-list]'), formItems = $('[data-form-list-items]');
  var opener = null;

  var render = function () {
    var n = count();
    bagCount.textContent = n;
    bag.classList.toggle('is-on', n > 0);
    bag.setAttribute('aria-label', 'Minha lista de locação, ' + n + (n === 1 ? ' item' : ' itens'));

    $$('[data-add]', grid).forEach(function (b) {
      var on = !!list[b.dataset.add];
      b.setAttribute('aria-pressed', on);
      var nome = byId[b.dataset.add].nome;
      b.setAttribute('aria-label', on ? nome + ' está na lista. Remover da lista' : 'Adicionar ' + nome + ' à lista');
      b.title = on ? 'Na lista (clique para remover)' : 'Adicionar à lista';
    });

    itemsEl.innerHTML = '';
    CATALOG.forEach(function (p) {
      if (!list[p.id]) return;
      var li = document.createElement('li');
      li.className = 'drawer-item';
      li.innerHTML =
        '<div class="drawer-thumb">' + mediaHtml(p, true) + '</div>' +
        '<div><b>' + esc(p.nome) + '</b><span>' + esc(catLabel(p.cat)) + '</span><button type="button" class="drawer-remove" data-remove="' + p.id + '">Remover<span class="sr-only"> ' + esc(p.nome) + '</span></button></div>' +
        '<div class="stepper"><button type="button" data-step="-1" data-id="' + p.id + '" aria-label="Diminuir quantidade de ' + esc(p.nome) + '">−</button><output aria-live="polite">' + list[p.id] + '</output><button type="button" data-step="1" data-id="' + p.id + '" aria-label="Aumentar quantidade de ' + esc(p.nome) + '">+</button></div>';
      itemsEl.appendChild(li);
    });
    itemsEl.hidden = n === 0;
    emptyEl.hidden = n > 0;
    sendBtn.disabled = n === 0;
    formBtn.classList.toggle('is-disabled', n === 0);

    formList.hidden = n === 0;
    formItems.innerHTML = lines().map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('');
  };

  var bump = function () {
    bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump');
  };
  var toggleItem = function (id) {
    var p = byId[id];
    if (list[id]) { delete list[id]; live.textContent = p.nome + ' removido da lista.'; }
    else { list[id] = 1; live.textContent = p.nome + ' adicionado à lista.'; bump(); }
    save(); render();
  };
  var step = function (id, d) {
    var q = (list[id] || 0) + d;
    if (q <= 0) delete list[id]; else list[id] = Math.min(q, 30);
    save(); render();
  };

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (b) toggleItem(b.dataset.add);
  });
  itemsEl.addEventListener('click', function (e) {
    var s = e.target.closest('[data-step]'), r = e.target.closest('[data-remove]');
    if (s) {
      var id = s.dataset.id, d = +s.dataset.step;
      step(id, d);
      var again = $('[data-step="' + d + '"][data-id="' + id + '"]', itemsEl);
      (again || $('[data-bag-close]', drawer.lastElementChild)).focus();
    }
    if (r) {
      delete list[r.dataset.remove]; save(); render();
      var next = $('[data-remove]', itemsEl);
      (next || $('.drawer-panel [data-bag-close]')).focus();
    }
  });

  /* Painel */
  var lenis = function () { return window.__lenis || null; };
  var focusables = function () { return $$('button:not([disabled]), a[href]', drawer.lastElementChild).filter(function (el) { return el.offsetParent !== null; }); };
  var openDrawer = function (from) {
    opener = from || document.activeElement;
    render();
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
    root.classList.add('drawer-open'); bag.setAttribute('aria-expanded', 'true');
    if (lenis()) lenis().stop();
    setTimeout(function () { $('.drawer-panel [data-bag-close]').focus(); }, 60);
  };
  var closeDrawer = function (restore) {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
    root.classList.remove('drawer-open'); bag.setAttribute('aria-expanded', 'false');
    if (lenis()) lenis().start();
    if (restore !== false && opener && opener.focus) opener.focus({ preventScroll: true });
  };
  $$('[data-bag-open]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b); }); });
  $$('[data-bag-close]').forEach(function (b) { b.addEventListener('click', function () { closeDrawer(); }); });
  formBtn.addEventListener('click', function (e) {
    if (!count()) { e.preventDefault(); return; }
    closeDrawer(false); /* libera a rolagem antes do scroll para o formulário (main.js) */
  });
  document.addEventListener('keydown', function (e) {
    if (!drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); }
    if (e.key === 'Tab') {
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  sendBtn.addEventListener('click', function () {
    if (!count()) return;
    var msg = ['Olá, Mariluz! Tudo bem? Montei minha lista no site e quero fazer este pedido de locação para a minha festa:', ''].concat(detailLines().map(function (l) { return '• ' + l; }), ['', '*Total de peças:* ' + count(), '*Data da festa:* a definir', 'Pode me confirmar valores e disponibilidade? Obrigada!']);
    window.open(waUrl(msg), '_blank', 'noopener');
  });

  window.MariluzLista = { lines: detailLines, open: openDrawer };
  render();
})();
