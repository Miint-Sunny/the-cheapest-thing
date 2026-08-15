/* s3-rank.js — screen 3: the ranking interaction (BUILD-SPEC §6, screen 3).
   The only real interaction on the page. Three moves, then it ends.

   Each click does three things at once: the visitor's row FLIPs up the
   list, the changed-for-the-algorithm counter increments, and a diff line
   shows what was actually given up. After the third move the row sits at
   rank 12 with a dashed fold line above it — still below the fold.

   The five other results are deliberately interchangeable listicle slop
   (strings in copy.js, flagged as added keys). The visitor's row shows its
   own description straight from the diff copy — after "add keywords" the
   row's text visibly becomes the optimised version.

   Guidance: the "Try one." hint shows immediately above the buttons, the
   buttons cascade in on entry, and the first one breathes — the same
   press-me language as screen 0's Generate button. Auto-play still runs
   the three moves at 18 s, 1.2 s apart. SCREENS.s3.complete() lets screen
   4 fast-forward the state if the visitor scrolls on before finishing. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  const RANKS = [847, 312, 89, 12];
  const MOVE_ORDER = ['keywords', 'title', 'social'];

  const state = {
    moves: [], // move ids in click order
  };

  let ctx, root, listEl;
  let resEls = [], ellipsisEl = null, youEl = null, foldEl = null, rankNumEl = null, youDescEl = null;
  let autoTimer = 0, autoInterval = 0;

  function rank() {
    return RANKS[state.moves.length];
  }

  function resultRow() {
    const li = ctx.el('li', 'row row-res');
    li.setAttribute('aria-hidden', 'true');
    const main = ctx.el('span', 'res-main');
    main.append(ctx.el('span', 'res-url mono'), ctx.el('span', 'res-title'), ctx.el('span', 'res-snip'));
    li.append(ctx.el('span', 'row-fav skel'), main);
    return li;
  }

  function makeParts() {
    resEls = ctx.t('s3.results').map(resultRow);
    ellipsisEl = ctx.el('li', 'row-ellipsis', '· · ·');
    ellipsisEl.setAttribute('aria-hidden', 'true');

    youEl = ctx.el('li', 'row row-you');
    youEl.id = 'row-you';
    const main = ctx.el('span', 'row-main');
    main.append(ctx.el('span', 'row-title'), (youDescEl = ctx.el('span', 'row-desc')));
    const rankWrap = ctx.el('span', 'row-rank mono');
    rankWrap.append(ctx.el('span', 'rank-label'), document.createTextNode(' '), (rankNumEl = ctx.el('b', 'rank-num')));
    youEl.append(ctx.el('span', 'row-fav skel'), main, rankWrap);

    foldEl = ctx.el('li', 'fold-row');
    foldEl.append(ctx.el('span', 'fold-label mono'));
  }

  /* list order for a given number of completed moves */
  function orderFor(n) {
    const s = resEls;
    if (n === 0) return [s[0], s[1], s[2], s[3], s[4], ellipsisEl, youEl];
    if (n === 1) return [s[0], s[1], s[2], s[3], ellipsisEl, youEl, s[4]];
    if (n === 2) return [s[0], s[1], ellipsisEl, youEl, s[2], s[3], s[4]];
    return [s[0], s[1], foldEl, youEl, s[2], s[3], s[4]];
  }

  function relabelParts() {
    const data = ctx.t('s3.results');
    resEls.forEach(function (li, i) {
      li.querySelector('.res-url').textContent = data[i].url;
      li.querySelector('.res-title').textContent = data[i].title;
      li.querySelector('.res-snip').textContent = data[i].snippet;
    });
    youEl.querySelector('.row-title').textContent = ctx.t('s3.yourSite');
    youEl.querySelector('.rank-label').textContent = ctx.t('s3.rankLabel');
    foldEl.querySelector('.fold-label').textContent = ctx.t('s3.foldLabel');
    rankNumEl.textContent = String(rank());
    updateYouDesc();
  }

  /* the visitor's row describes itself with the diff copy — optimising the
     description visibly rewrites the row */
  function updateYouDesc() {
    const d = ctx.t('s3.diff').description;
    youDescEl.textContent = state.moves.indexOf('keywords') !== -1 ? d.after : d.before;
  }

  function renderList(animate) {
    const targets = orderFor(state.moves.length);

    if (!animate) {
      listEl.textContent = '';
      targets.forEach(function (n) { listEl.append(n); });
      relabelParts();
      return;
    }

    /* FLIP: measure, reorder, transform back, play to identity (§6: do not
       animate `top`) */
    const present = Array.prototype.slice.call(listEl.children);
    const first = new Map();
    present.forEach(function (n) { first.set(n, n.getBoundingClientRect().top); });

    listEl.textContent = '';
    targets.forEach(function (n) { listEl.append(n); });

    targets.forEach(function (n) {
      const was = first.get(n);
      if (was == null) {
        /* newly inserted (the fold line): fade it in */
        n.animate({ opacity: [0, 1] }, { duration: 500, delay: 250, easing: 'ease-out', fill: 'backwards' });
        return;
      }
      const dy = was - n.getBoundingClientRect().top;
      if (dy) {
        n.animate(
          { transform: ['translateY(' + dy + 'px)', 'translateY(0)'] },
          { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
      }
    });
  }

  function animateRankTo(value) {
    const from = parseInt(rankNumEl.textContent, 10) || value;
    const start = performance.now();
    const dur = 620;
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      rankNumEl.textContent = String(Math.round(from + (value - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function diffBlock(kind) {
    const map = { keywords: 'description', title: 'title', social: 'posted' };
    const key = map[kind];
    const d = ctx.t('s3.diff')[key];
    const block = ctx.el('div', 'diff');
    block.dataset.kind = kind;
    block.append(ctx.el('span', 'diff-k', ctx.t('s3.diffLabels')[key]));
    const del = document.createElement('del');
    del.textContent = d.before;
    const ins = document.createElement('ins');
    ins.textContent = d.after;
    block.append(del, ins);
    return block;
  }

  function renderDiffs() {
    const host = root.querySelector('.serp-diffs');
    host.textContent = '';
    state.moves.forEach(function (kind) {
      host.append(diffBlock(kind));
    });
  }

  function counterEl() {
    return root.querySelector('.serp-counter .count');
  }

  function updateAfterMoves(finished) {
    counterEl().textContent = String(state.moves.length);
    if (state.moves.length >= 3) {
      root.querySelectorAll('.act').forEach(function (b) { b.disabled = true; });
      root.querySelector('.serp-result').hidden = false;
    }
    if (finished) {
      root.querySelector('.serp-hint').hidden = true;
    }
  }

  function clearTimers() {
    clearTimeout(autoTimer);
    clearInterval(autoInterval);
    autoTimer = autoInterval = 0;
  }

  function applyMove(kind, animate) {
    if (state.moves.length >= 3 || state.moves.indexOf(kind) !== -1) return;
    state.moves.push(kind);

    const first = root.querySelector('.serp-actions .act');
    if (first) first.classList.remove('act-beckon');
    const btn = root.querySelector('.act[data-move="' + kind + '"]');
    if (btn) btn.disabled = true;

    renderList(animate);
    updateYouDesc();
    if (animate) animateRankTo(rank());
    else rankNumEl.textContent = String(rank());

    const host = root.querySelector('.serp-diffs');
    const block = diffBlock(kind);
    host.append(block);
    if (animate) {
      block.animate(
        { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0)'] },
        { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
    }

    updateAfterMoves(true);
  }

  function onUserMove(kind) {
    clearTimers();
    root.querySelector('.serp-hint').hidden = true;
    applyMove(kind, !ctx.reduced);
  }

  function autoplay() {
    /* no interaction after 18 s: play the three moves 1.2 s apart (§5) */
    const pending = MOVE_ORDER.filter(function (k) { return state.moves.indexOf(k) === -1; });
    let i = 0;
    if (!pending.length) return;
    applyMove(pending[i++], true);
    autoInterval = setInterval(function () {
      if (i >= pending.length) { clearInterval(autoInterval); return; }
      applyMove(pending[i++], true);
    }, 1200);
  }

  SCREENS.s3 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s3');
      listEl = root.querySelector('.serp-list');
      makeParts();
      renderList(false);
      renderDiffs();
      updateAfterMoves(false);

      root.querySelectorAll('.act').forEach(function (b) {
        b.addEventListener('click', function () { onUserMove(b.dataset.move); });
      });
    },

    relabel() {
      relabelParts();
      renderDiffs();
      /* counter label and buttons are data-copy nodes; state persists */
    },

    enter() {
      if (state.moves.length) return;

      /* first-time visitors must know the next step at once: the hint shows
         immediately above the buttons, the buttons cascade in, and the first
         one breathes — the same "press me" language as screen 0's Generate */
      const hint = root.querySelector('.serp-hint');
      hint.hidden = false;
      hint.animate({ opacity: [0, 1] }, { duration: 500, delay: 900, easing: 'ease-out', fill: 'backwards' });
      const acts = root.querySelectorAll('.serp-actions .act');
      Array.prototype.forEach.call(acts, function (b, i) {
        b.animate(
          { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0)'] },
          { duration: 500, delay: 350 + i * 130, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }
        );
      });
      if (acts[0]) acts[0].classList.add('act-beckon');

      autoTimer = setTimeout(function () {
        if (!state.moves.length) autoplay();
      }, 18000);
    },

    leave() {
      clearTimers();
    },

    /* used by screen 4 when the visitor scrolls on before finishing */
    complete() {
      clearTimers();
      while (state.moves.length < 3) {
        const next = MOVE_ORDER.filter(function (k) { return state.moves.indexOf(k) === -1; })[0];
        applyMove(next, false);
      }
    },

    showFinalState() {
      SCREENS.s3.complete();
    },

    moveCount() {
      return state.moves.length;
    },
  };
})();
