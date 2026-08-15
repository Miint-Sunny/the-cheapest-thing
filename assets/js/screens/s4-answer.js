/* s4-answer.js — screen 4: "Then the list stopped mattering"
   (BUILD-SPEC §6, screen 4).

   Continuity: this is the SAME results list from screen 3, in the same
   DOM — the actual nodes are adopted into this section's dock when the
   section activates (and handed back if the visitor scrolls up). The AI
   answer box grows from the top and pushes the list — including the
   hard-won rank-12 row — down past the dock's clipped edge.

   Beat two draws exactly 38,065 faint marks on a canvas with a single
   --signal mark: one AI crawler's fetches for every visit it sent back.
   The caveat about the measurement stays on screen. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  const MARKS = 38065;
  const SIGNAL_AT = 23486; /* fixed position for the one returned visit */

  let ctx, root, dock, box;
  let serpSlot = null; /* placeholder left behind in screen 3's grid */
  let boxShown = false, crawlDrawn = false;
  let crawlObs = null;

  /* ------------------------------------------------------------ figures */

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
    host.append(ctx.el('p', 'fig-chip mono', ctx.chipText(ctx.fig(keys[0]))));
  }

  function renderCrawlFigure() {
    const host = root.querySelector('.crawl-figure');
    host.textContent = '';
    host.append(ctx.buildFigure(ctx.t('s4.crawlFigure')));
  }

  /* ------------------------------------------------------- serp adoption */

  function serpEl() {
    return document.getElementById('serp');
  }

  function adoptSerp() {
    const serp = serpEl();
    if (!serp || serp.parentNode === dock) return;
    /* leave a same-sized placeholder in screen 3's grid so nothing
       collapses, and so the list can go back to its exact slot */
    serpSlot = ctx.el('div');
    serpSlot.style.minHeight = serp.offsetHeight + 'px';
    serp.parentNode.insertBefore(serpSlot, serp);
    dock.append(serp);
    root.querySelector('.answer-stage').classList.add('docked');
    if (!ctx.reduced) {
      serp.animate({ opacity: [0, 1] }, { duration: 300, easing: 'ease-out' });
    }
  }

  function returnSerp() {
    const serp = serpEl();
    if (!serp || !serpSlot || serp.parentNode !== dock) return;
    serpSlot.parentNode.replaceChild(serp, serpSlot);
    serpSlot = null;
    root.querySelector('.answer-stage').classList.remove('docked');
  }

  /* ------------------------------------------------------ the answer box */

  function growBox() {
    if (boxShown) return;
    boxShown = true;
    box.classList.remove('collapsed');
    const h = box.scrollHeight;
    box.animate(
      { height: ['0px', h + 'px'], opacity: [0, 1] },
      { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
    Array.prototype.forEach.call(box.querySelectorAll('.stat, .ans-figs .fig-chip'), function (n, i) {
      n.animate(
        { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0)'] },
        { duration: 500, delay: 420 + i * 140, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }
      );
    });
  }

  /* -------------------------------------------------------- crawl canvas */

  function crawlCanvas() {
    return root.querySelector('.crawl-field');
  }

  function layoutCrawl() {
    const canvas = crawlCanvas();
    const w = canvas.parentNode.clientWidth;
    const cell = w < 520 ? 2 : 3;
    const mark = cell - 1;
    const cols = Math.floor(w / cell);
    const rows = Math.ceil(MARKS / cols);
    const h = rows * cell;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const g = canvas.getContext('2d');
    g.scale(dpr, dpr);
    return { g: g, cols: cols, cell: cell, mark: mark, w: w, h: h };
  }

  /* the locate beat: coordinate axes snap onto the one returned visit */
  function drawCrosshair(L) {
    const cx = (SIGNAL_AT % L.cols) * L.cell + L.mark / 2;
    const cy = Math.floor(SIGNAL_AT / L.cols) * L.cell + L.mark / 2;
    L.g.fillStyle = 'rgb(255 90 31 / 0.8)';
    L.g.fillRect(0, cy, L.w, 1);
    L.g.fillRect(cx, 0, 1, L.h);
    L.g.fillStyle = '#FF5A1F';
    L.g.fillRect(cx - 3, cy - 3, 6, 6);
  }

  function drawCrawl(progressive) {
    const L = layoutCrawl();
    let i = 0;
    function chunk(upTo) {
      for (; i < upTo && i < MARKS; i++) {
        const x = (i % L.cols) * L.cell;
        const y = Math.floor(i / L.cols) * L.cell;
        if (i === SIGNAL_AT) {
          L.g.fillStyle = '#FF5A1F';
          L.g.fillRect(x - 1, y - 1, L.mark + 2, L.mark + 2);
        } else {
          L.g.fillStyle = 'rgb(11 11 12 / 0.16)';
          L.g.fillRect(x, y, L.mark, L.mark);
        }
      }
    }
    if (!progressive) {
      chunk(MARKS);
      drawCrosshair(L);
      crawlDrawn = true;
      return;
    }
    const perFrame = Math.ceil(MARKS / 90); /* ~1.5 s at 60 fps */
    (function step() {
      chunk(i + perFrame);
      if (i < MARKS) {
        requestAnimationFrame(step);
      } else {
        crawlDrawn = true;
        setTimeout(function () { drawCrosshair(L); }, 260);
      }
    })();
  }

  function watchCrawl() {
    crawlObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !crawlDrawn) {
          crawlDrawn = true;
          drawCrawl(true);
          crawlObs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    crawlObs.observe(root.querySelector('.crawl'));
  }

  /* the closing line fades up when it comes into view */
  function watchClosing() {
    const line = root.querySelector('.s4-closing');
    line.classList.add('pending');
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          line.classList.remove('pending');
          io.disconnect();
        }
      });
    }, { threshold: 0.6 });
    io.observe(line);
  }

  /* ---------------------------------------------------------- lifecycle */

  SCREENS.s4 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s4');
      dock = root.querySelector('.serp-dock');
      box = root.querySelector('.answer-box');
      renderStats();
      renderCrawlFigure();
      if (!ctx.reduced) {
        box.classList.add('collapsed');
        watchCrawl();
        watchClosing();
      }

      let rt = 0;
      addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
          if (crawlDrawn) drawCrawl(false);
        }, 180);
      });
    },

    relabel() {
      renderStats();
      renderCrawlFigure();
    },

    enter() {
      /* a visitor who scrolled on before finishing screen 3 still gets
         the whole argument: fast-forward the list to its final state */
      if (SCREENS.s3 && SCREENS.s3.complete) SCREENS.s3.complete();
      adoptSerp();
      setTimeout(growBox, 350);
    },

    /* called on every activation change (not just the once-only enter) */
    activate() {
      if (boxShown) adoptSerp();
    },

    deactivate(nextId) {
      /* hand the list back when the visitor scrolls up to screen 3 */
      if (nextId === 's3') returnSerp();
    },

    leave() {},

    showFinalState() {
      /* reduced motion: the list STAYS on screen 3, complete; this screen
         shows the answer box, the drawn field and the closing line */
      box.classList.remove('collapsed');
      dock.hidden = true;
      drawCrawl(false);
    },
  };
})();
