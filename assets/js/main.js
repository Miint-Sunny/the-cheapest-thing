/* main.js — boot, i18n fill, shared helpers.
   Classic scripts throughout (no modules) so the page also runs over file://.
   COPY and FIGURES are top-level consts from copy.js, visible here. */
(function () {
  'use strict';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ORDER = ['s0', 's1', 's2', 's3', 's4', 's5', 's6'];

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  const APP = (window.APP = {
    lang: 'en',
    reduced: REDUCED,
    el,

    /* resolve "s1.lead" → COPY.s1[lang].lead (arrays/objects come back as-is) */
    t(path) {
      const parts = path.split('.');
      let node = COPY[parts[0]] && COPY[parts[0]][APP.lang];
      for (let i = 1; i < parts.length; i++) node = node == null ? node : node[parts[i]];
      return node;
    },

    fig(key) {
      return FIGURES[key];
    },

    chipText(f) {
      return f.source + ' · as of ' + f.asOf + ' · retrieved ' + f.retrieved;
    },

    /* The one component every statistic renders through (BUILD-SPEC §7). */
    buildFigure(key) {
      const f = FIGURES[key];
      const fig = el('figure', 'figure');
      fig.append(el('div', 'fig-value mono', f.value), el('p', 'fig-claim', f.claim[APP.lang]), el('p', 'fig-chip', APP.chipText(f)));
      if (f.caveat) fig.append(el('p', 'fig-caveat', f.caveat[APP.lang]));
      return fig;
    },

    fillCopy() {
      document.querySelectorAll('[data-copy]').forEach(function (node) {
        const v = APP.t(node.dataset.copy);
        if (typeof v === 'string') node.textContent = v;
      });
      document.documentElement.lang = APP.lang;
      document.title = APP.t('global.documentTitle');
      const md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute('content', APP.t('global.metaDescription'));

      const toggle = document.querySelector('.lang-toggle');
      if (toggle) toggle.setAttribute('aria-label', APP.t('global.langToggleAria'));
      const rail = document.querySelector('.rail');
      if (rail) rail.setAttribute('aria-label', APP.t('global.railAria'));
      const names = APP.t('global.sectionNames');
      ORDER.forEach(function (id, i) {
        const s = document.getElementById(id);
        if (s) s.setAttribute('aria-label', names[i]);
      });
    },
  });

  /* ------------------------------------------------------------- i18n */
  /* Language lives in memory only — no storage of any kind (§2). The
     toggle re-renders every data-copy node and asks each screen to
     relabel its JS-built content without touching animation state. */

  APP.setLang = function (lang) {
    APP.lang = lang;
    APP.fillCopy();
    ORDER.forEach(function (id) {
      if (SCREENS[id] && SCREENS[id].relabel) SCREENS[id].relabel();
    });
  };

  function wireLangToggle() {
    const toggle = document.querySelector('.lang-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      APP.setLang(APP.lang === 'en' ? 'zh' : 'en');
    });
  }

  /* -------------------------------------------- sections, rail, dwell */

  /* which chrome colour the fixed UI needs over each section */
  const REGISTER = { s0: 'dark', s1: 'light', s2: 'light', s3: 'light', s4: 'light', s5: 'dark', s6: 'dark' };

  const entered = new Set();
  let activeId = null;
  const dwell = { s0: 0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, s6: 0 };
  let activeSince = performance.now();
  const t0 = performance.now();

  function railButtons() {
    return Array.prototype.slice.call(document.querySelectorAll('.rail button'));
  }

  function buildRail() {
    const rail = document.querySelector('.rail');
    rail.hidden = false;
    const names = APP.t('global.sectionNames');
    ORDER.forEach(function (id, i) {
      const b = el('button');
      b.type = 'button';
      b.setAttribute('aria-label', names[i]);
      b.addEventListener('click', function () {
        document.getElementById(id).scrollIntoView({ behavior: APP.reduced ? 'auto' : 'smooth' });
      });
      rail.append(b);
    });
  }

  function setActive(id) {
    if (id === activeId) return;
    const now = performance.now();
    if (activeId) {
      dwell[activeId] += now - activeSince;
      if (entered.has(activeId) && SCREENS[activeId] && SCREENS[activeId].leave) SCREENS[activeId].leave();
      if (SCREENS[activeId] && SCREENS[activeId].deactivate) SCREENS[activeId].deactivate(id);
    }
    activeId = id;
    activeSince = now;

    const idx = ORDER.indexOf(id);
    railButtons().forEach(function (b, i) {
      if (i === idx) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    const on = REGISTER[id] === 'light' ? 'light' : 'dark';
    document.querySelector('.rail').dataset.on = on;
    document.querySelector('.lang-toggle').dataset.on = on;

    /* enter() fires once per screen, ever (§5); activate() fires on every
       visit so screens can restore shared state (the adopted list) */
    if (!entered.has(id)) {
      entered.add(id);
      if (!APP.reduced && SCREENS[id] && SCREENS[id].enter) SCREENS[id].enter();
    } else if (!APP.reduced && SCREENS[id] && SCREENS[id].activate) {
      SCREENS[id].activate();
    }
  }

  function observeSections() {
    /* "Active" means the section straddles the middle band of the viewport.
       The spec's threshold-0.55 intent breaks on sections taller than the
       viewport (their visible ratio can never reach 0.55), so the band is
       measured against the viewport instead. */
    const io = new IntersectionObserver(
      function (entries) {
        let best = null;
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          if (!best || e.intersectionRect.height > best.intersectionRect.height) best = e;
        });
        if (best) setActive(best.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    ORDER.forEach(function (id) {
      io.observe(document.getElementById(id));
    });
  }

  /* ---------------------------------------------------- ?debug=1 panel */

  function buildDebug() {
    if (new URLSearchParams(location.search).get('debug') !== '1') return;
    const box = document.querySelector('.debug');
    box.hidden = false;

    const total = el('div');
    const rows = ORDER.map(function (id) {
      const r = el('div');
      r.dataset.for = id;
      return r;
    });
    const jump = el('div', 'dbg-jump');
    ORDER.forEach(function (id, i) {
      const b = el('button', null, String(i));
      b.type = 'button';
      b.addEventListener('click', function () {
        document.getElementById(id).scrollIntoView({ behavior: APP.reduced ? 'auto' : 'smooth' });
      });
      jump.append(b);
    });
    box.append(total);
    rows.forEach(function (r) { box.append(r); });
    box.append(jump);

    setInterval(function () {
      const now = performance.now();
      const totalS = (now - t0) / 1000;
      total.innerHTML = 'total <b>' + totalS.toFixed(1) + 's</b>';
      ORDER.forEach(function (id, i) {
        const ms = dwell[id] + (id === activeId ? now - activeSince : 0);
        rows[i].innerHTML = id + ' <b>' + (ms / 1000).toFixed(1) + 's</b>' + (id === activeId ? ' ·' : '');
      });
    }, 500);
  }

  function boot() {
    APP.fillCopy();
    ORDER.forEach(function (id) {
      if (window.SCREENS && SCREENS[id] && SCREENS[id].build) SCREENS[id].build(APP);
    });
    wireLangToggle();
    buildRail();

    if (APP.reduced) {
      /* reduced motion: every screen renders its final state immediately;
         enter() never runs animations (§5) */
      ORDER.forEach(function (id) {
        if (SCREENS[id] && SCREENS[id].showFinalState) SCREENS[id].showFinalState();
      });
    }

    observeSections();
    buildDebug();
  }

  boot();
})();
