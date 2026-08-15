/* s0-generate.js — screen 0: "Generate" (BUILD-SPEC §6, screen 0).
   Static skeleton first: the finished mock page, the full prompt and the
   button are all visible. The choreographed sequence lands in a later step. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  let ctx, root;

  SCREENS.s0 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s0');
    },
    relabel() {},
    enter() {},
    leave() {},
    showFinalState() {},
  };
})();
