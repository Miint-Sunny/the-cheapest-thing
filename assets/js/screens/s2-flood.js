/* s2-flood.js — screen 2: "So everyone did" (BUILD-SPEC §6, screen 2).
   Static skeleton first: the figure with its source chip. The canvas tile
   flood lands in the canvas step. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  let ctx, root;

  function renderFigure() {
    const host = root.querySelector('.s2-figure');
    host.textContent = '';
    host.append(ctx.buildFigure(ctx.t('s2.figure')));
  }

  SCREENS.s2 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s2');
      renderFigure();
    },
    relabel() {
      renderFigure();
    },
    enter() {},
    leave() {},
    showFinalState() {},
  };
})();
