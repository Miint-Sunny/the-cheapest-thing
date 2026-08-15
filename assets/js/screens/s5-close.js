/* s5-close.js — screen 5: "This website was made by AI too"
   (BUILD-SPEC §6, screen 5). The build-facts panel; values marked [TODO]
   in copy.js are filled at freeze time, not here. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  let ctx, root;

  function renderRows() {
    const host = root.querySelector('.build-rows');
    host.textContent = '';
    ctx.t('s5.buildRows').forEach(function (r) {
      const row = ctx.el('div');
      const dt = ctx.el('dt', null, r.k);
      const dd = ctx.el('dd');
      if (/^https?:\/\//.test(r.v)) {
        const a = ctx.el('a', null, r.v);
        a.href = r.v;
        a.rel = 'noopener';
        dd.append(a);
      } else {
        dd.textContent = r.v;
      }
      row.append(dt, dd);
      host.append(row);
    });
  }

  SCREENS.s5 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s5');
      renderRows();
      if (!ctx.reduced) {
        root.querySelector('.closing').classList.add('pending');
      }
    },
    relabel() {
      renderRows();
    },
    enter() {
      /* the closing line lands half a beat after the rest of the screen */
      setTimeout(function () {
        root.querySelector('.closing').classList.remove('pending');
      }, 650);
    },
    leave() {},
    showFinalState() {
      root.querySelector('.closing').classList.remove('pending');
    },
  };
})();
