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

  function boot() {
    APP.fillCopy();
    ORDER.forEach(function (id) {
      if (window.SCREENS && SCREENS[id] && SCREENS[id].build) SCREENS[id].build(APP);
    });
    wireLangToggle();
  }

  boot();
})();
