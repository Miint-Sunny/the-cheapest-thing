/* s2-flood.js — screen 2: "So everyone did" (BUILD-SPEC §6, screen 2).

   A canvas floods with ~800 procedurally drawn "website" cards (~300 under
   700 px), tiling outward from the centre and accelerating over ~2.5 s,
   then the whole field shrinks and blurs into noise (CSS transform+filter
   on the canvas — GPU-composited and supported everywhere, unlike
   ctx.filter). One figure surfaces over it, with its source chip.

   Canvas, not DOM nodes: 800 animated elements would drop frames on
   mobile. Every card is drawn from palette colours at varying alphas. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  let ctx, root, canvas, g;
  let cards = [], raf = 0, t0 = 0, done = false, started = false, drawn = 0;

  /* deterministic PRNG so the field is identical on every visit */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const FLOOD_MS = 2500;

  function layout() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = root.clientWidth;
    const h = root.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    g = canvas.getContext('2d');
    g.scale(dpr, dpr);

    const target = w < 700 ? 300 : 800;
    const cellH = Math.sqrt((w * h) / target / 1.5);
    const cellW = cellH * 1.5;
    const cols = Math.ceil(w / cellW);
    const rows = Math.ceil(h / cellH);
    const rand = mulberry32(20260816);

    cards = [];
    const cx = cols / 2 - 0.5;
    const cy = rows / 2 - 0.5;
    let maxD = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = Math.hypot((c - cx) * cellW, (r - cy) * cellH) + rand() * cellW * 1.4;
        maxD = Math.max(maxD, d);
        const bars = 3 + Math.floor(rand() * 3); // 3–5 grey bars
        const widths = [];
        for (let b = 0; b < bars; b++) widths.push(0.45 + rand() * 0.5);
        cards.push({
          x: c * cellW + cellW * 0.08 + (rand() - 0.5) * 3,
          y: r * cellH + cellH * 0.10 + (rand() - 0.5) * 3,
          w: cellW * 0.82,
          h: cellH * 0.78,
          d: d,
          widths: widths,
          accent: { side: rand() < 0.5, a: 0.2 + rand() * 0.3 },
        });
      }
    }
    /* spawn order radiates outward; accelerate by compressing late spawns */
    cards.forEach(function (card) {
      const p = card.d / maxD;
      card.t = FLOOD_MS * Math.pow(p, 1.65);
    });
    cards.sort(function (a, b) { return a.t - b.t; });
    drawn = 0;
  }

  function drawCard(card) {
    const x = card.x, y = card.y, w = card.w, h = card.h;
    g.strokeStyle = 'rgb(107 106 102 / 0.35)';
    g.lineWidth = 1;
    g.strokeRect(x, y, w, h);
    const pad = w * 0.1;
    const barH = Math.max(1.5, h * 0.09);
    const gap = (h - pad * 2 - barH * card.widths.length) / Math.max(1, card.widths.length - 1);
    card.widths.forEach(function (bw, i) {
      g.fillStyle = 'rgb(11 11 12 / 0.14)';
      g.fillRect(x + pad, y + pad + i * (barH + gap), (w - pad * 2) * bw, barH);
    });
    /* the one small "coloured" block — a darker ink shade; --signal is
       reserved for the visitor's own site and never appears here */
    g.fillStyle = 'rgb(11 11 12 / ' + card.accent.a.toFixed(2) + ')';
    const aw = w * 0.2, ah = barH * 1.8;
    g.fillRect(card.accent.side ? x + pad : x + w - pad - aw, y + h - pad - ah, aw, ah);
  }

  function frame(now) {
    /* cards never move once placed — draw only the newly spawned ones */
    const t = now - t0;
    while (drawn < cards.length && cards[drawn].t <= t) {
      drawCard(cards[drawn]);
      drawn += 1;
    }
    if (drawn < cards.length) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = 0;
      settle();
    }
  }

  function drawAll() {
    g.clearRect(0, 0, canvas.width, canvas.height);
    cards.forEach(drawCard);
    drawn = cards.length;
  }

  function settle() {
    done = true;
    root.classList.add('flooded');   /* canvas shrinks + blurs via CSS */
    root.classList.add('surfaced');  /* the figure comes up over the noise */
  }

  SCREENS.s2 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s2');
      canvas = root.querySelector('.flood');
      renderFigure();
      if (!ctx.reduced) root.classList.add('pending');

      let rt = 0;
      addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
          if (!started) return;
          layout();
          drawAll();
        }, 180);
      });
    },

    relabel() {
      renderFigure();
    },

    enter() {
      if (started) return;
      started = true;
      layout();
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    },

    leave() {
      if (raf) {
        /* if the visitor scrolls on mid-flood, finish the field instantly
           so coming back shows the completed state */
        cancelAnimationFrame(raf);
        raf = 0;
        drawAll();
        settle();
      }
    },

    showFinalState() {
      started = true;
      layout();
      drawAll();
      settle();
    },
  };

  function renderFigure() {
    const host = root.querySelector('.s2-figure');
    host.textContent = '';
    host.append(ctx.buildFigure(ctx.t('s2.figure')));
  }
})();
