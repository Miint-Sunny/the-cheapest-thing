/* s1-cost.js — screen 1: "What that cost in 2005" (BUILD-SPEC §6, screen 1).
   Three bars, drawn to scale, NOT log-scaled: full width / ~14% / a 2px
   sliver. The sliver is the visitor's own cost, so it takes --signal. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  const WIDTHS = ['100%', '14%', '2px'];
  let ctx, root;

  function renderBars() {
    const host = root.querySelector('.bars');
    const bars = ctx.t('s1.bars');
    host.textContent = '';
    bars.forEach(function (b, i) {
      const row = ctx.el('div', 'bar-row' + (i === 2 ? ' bar-you' : ''));
      const meta = ctx.el('div', 'bar-meta');
      meta.append(ctx.el('span', 'bar-year', b.year), ctx.el('span', 'bar-label', b.label), ctx.el('span', 'bar-cost', b.cost));
      const track = ctx.el('div', 'bar-track');
      const fill = ctx.el('div', 'bar-fill');
      fill.style.width = WIDTHS[i];
      track.append(fill);
      row.append(meta, track);
      host.append(row);
    });
  }

  SCREENS.s1 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s1');
      /* the superscript marker points at Manovich (2009); its accessible
         name is the reference itself, verbatim from COPY.references */
      const cite = root.querySelector('.cite');
      const manovich = COPY.references.find(function (r) { return r.indexOf('Manovich') === 0; });
      if (cite && manovich) cite.setAttribute('aria-label', manovich);
      renderBars();
    },
    relabel() {
      renderBars();
    },
    enter() {},
    leave() {},
    showFinalState() {},
  };
})();
