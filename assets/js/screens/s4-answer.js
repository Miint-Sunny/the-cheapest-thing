/* s4-answer.js — screen 4: "Then the list stopped mattering"
   (BUILD-SPEC §6, screen 4). Static skeleton first: the answer box with its
   three click-rate stats and one shared source chip (all three share one
   source and date), and the crawl-ratio figure with its caveat on screen.
   The push-down of the screen-3 list and the 38,065-mark canvas land later. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  let ctx, root;

  function renderStats() {
    const host = root.querySelector('.ans-figs');
    host.textContent = '';
    const keys = ctx.t('s4.figures');
    keys.forEach(function (key) {
      const f = ctx.fig(key);
      const row = ctx.el('div', 'stat');
      row.append(ctx.el('span', 'stat-value', f.value), ctx.el('span', 'stat-claim', f.claim[ctx.lang]));
      host.append(row);
    });
    /* the three stats share one source — one chip covers them */
    host.append(ctx.el('p', 'fig-chip mono', ctx.chipText(ctx.fig(keys[0]))));
  }

  function renderCrawlFigure() {
    const host = root.querySelector('.crawl-figure');
    host.textContent = '';
    host.append(ctx.buildFigure(ctx.t('s4.crawlFigure')));
  }

  SCREENS.s4 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s4');
      renderStats();
      renderCrawlFigure();
    },
    relabel() {
      renderStats();
      renderCrawlFigure();
    },
    enter() {},
    leave() {},
    showFinalState() {},
  };
})();
