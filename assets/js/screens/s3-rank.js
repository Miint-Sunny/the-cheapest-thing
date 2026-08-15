/* s3-rank.js — screen 3: the ranking interaction (BUILD-SPEC §6, screen 3).
   Static skeleton first: the results list with the visitor's row at 847 and
   the three diff lines readable. The FLIP interaction lands in its own step.

   The five "plausible result rows" are deliberately drawn as grey skeleton
   rows, not fake text: on this page grey bars are the visual language for
   interchangeable machine-made content, and the visitor's site is the only
   row with words. It also keeps invented copy off the page. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  /* fixed "random" widths for the five skeleton results (title, url, snippet) */
  const SKEL_ROWS = [
    [62, 30, 88],
    [48, 26, 74],
    [70, 34, 81],
    [55, 22, 90],
    [66, 28, 68],
  ];

  const state = {
    moves: [], // move ids in click order: 'keywords' | 'title' | 'social'
    rank: 847,
  };

  const DIFF_FOR_MOVE = { keywords: 'description', title: 'title', social: 'posted' };

  let ctx, root, listEl;

  function skelRow(widths) {
    const li = ctx.el('li', 'row');
    li.setAttribute('aria-hidden', 'true');
    const lines = ctx.el('span', 'row-lines');
    ['skel skel-title', 'skel', 'skel'].forEach(function (cls, i) {
      const bar = ctx.el('i', cls);
      bar.style.width = widths[i] + '%';
      lines.append(bar);
    });
    li.append(ctx.el('span', 'row-fav skel'), lines);
    return li;
  }

  function youRow() {
    const li = ctx.el('li', 'row row-you');
    li.id = 'row-you';
    const main = ctx.el('span', 'row-main');
    main.append(ctx.el('span', 'row-title', ctx.t('s3.yourSite')), ctx.el('i', 'row-sub skel'));
    const rank = ctx.el('span', 'row-rank mono');
    rank.append(ctx.el('span', 'rank-label', ctx.t('s3.rankLabel')), document.createTextNode(' '), ctx.el('b', 'rank-num', String(state.rank)));
    li.append(ctx.el('span', 'row-fav skel'), main, rank);
    return li;
  }

  function renderList() {
    listEl.textContent = '';
    SKEL_ROWS.forEach(function (w) { listEl.append(skelRow(w)); });
    const dots = ctx.el('li', 'row-ellipsis', '· · ·');
    dots.setAttribute('aria-hidden', 'true');
    listEl.append(dots, youRow());
  }

  function diffBlock(kind) {
    const d = ctx.t('s3.diff')[kind];
    const wrapEl = ctx.el('div', 'diff');
    wrapEl.append(ctx.el('span', 'diff-k', ctx.t('s3.diffLabels')[kind]));
    const del = document.createElement('del');
    del.textContent = d.before;
    const ins = document.createElement('ins');
    ins.textContent = d.after;
    wrapEl.append(del, ins);
    return wrapEl;
  }

  function renderDiffs() {
    const host = root.querySelector('.serp-diffs');
    host.textContent = '';
    /* static skeleton: all three diffs readable, canonical order */
    ['title', 'description', 'posted'].forEach(function (kind) {
      host.append(diffBlock(kind));
    });
  }

  SCREENS.s3 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s3');
      listEl = root.querySelector('.serp-list');
      renderList();
      renderDiffs();
    },
    relabel() {
      renderList();
      renderDiffs();
    },
    enter() {},
    leave() {},
    showFinalState() {},
  };
})();
