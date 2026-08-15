/* s1-cost.js — screen 1: "What that cost in 2005" (BUILD-SPEC §6, screen 1).
   Three bars, drawn to scale, NOT log-scaled: full width / ~14% / a 2px
   sliver. The sliver is the visitor's own cost, so it takes --signal. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  const WIDTHS = ['100%', '14%', '2px'];
  let ctx, root, revealed = false;

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
      fill.style.width = revealed ? WIDTHS[i] : '0px';
      track.append(fill);
      row.append(meta, track);
      host.append(row);
    });
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    Array.prototype.forEach.call(root.querySelectorAll('.bar-fill'), function (fill, i) {
      fill.style.width = WIDTHS[i];
      fill.animate(
        { width: ['0px', WIDTHS[i]] },
        { duration: 900, delay: i * 180, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }
      );
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
      if (c.reduced) revealed = true;
    },
    relabel() {
      renderBars();
    },
    enter() {
      reveal();
    },
    leave() {},
    showFinalState() {
      revealed = true;
      renderBars();
    },
  };
})();
