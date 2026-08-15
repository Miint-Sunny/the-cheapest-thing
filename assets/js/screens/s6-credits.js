/* s6-credits.js — screen 6: credits (BUILD-SPEC §6, screen 6).
   References render verbatim from COPY.references with every URL a working
   link. The Open Graph card is rendered live from the page's own meta tags —
   nothing about it is hardcoded; edit the tags and the card changes. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  let ctx, root;

  function renderMadeBy() {
    const host = root.querySelector('.cred-made');
    host.textContent = '';
    ctx.t('s6.madeByLines').forEach(function (line) {
      host.append(ctx.el('li', null, line));
    });
  }

  function linkifiedItem(str) {
    const li = document.createElement('li');
    str.split(/(https?:\/\/[^\s]+)/).forEach(function (part) {
      if (/^https?:\/\//.test(part)) {
        const a = ctx.el('a', null, part);
        a.href = part;
        a.rel = 'noopener';
        li.append(a);
      } else if (part) {
        li.append(document.createTextNode(part));
      }
    });
    return li;
  }

  function renderRefs() {
    const host = root.querySelector('.refs');
    host.textContent = '';
    COPY.references.forEach(function (r) {
      host.append(linkifiedItem(r));
    });
  }

  function metaContent(prop) {
    const m = document.querySelector('meta[property="' + prop + '"]');
    return m ? m.getAttribute('content') : '';
  }

  function renderOgCard() {
    const host = root.querySelector('.og-card');
    host.textContent = '';
    const imgUrl = metaContent('og:image');
    const pageUrl = metaContent('og:url');

    const img = document.createElement('img');
    img.alt = '';
    img.src = imgUrl;
    /* over file:// the absolute URL in the meta tag is unreachable — fall
       back to the same file by its relative path so the card still renders */
    img.onerror = function () {
      img.onerror = null;
      img.src = 'assets/img/og.png';
    };

    let domain = pageUrl;
    try { domain = new URL(pageUrl).host; } catch (e) { /* leave as-is */ }

    const text = ctx.el('div', 'og-card-text');
    text.append(
      ctx.el('p', 'og-card-domain', domain),
      ctx.el('p', 'og-card-title', metaContent('og:title')),
      ctx.el('p', 'og-card-desc', metaContent('og:description'))
    );
    host.append(img, text);
  }

  SCREENS.s6 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s6');
      renderMadeBy();
      renderRefs();
      renderOgCard();
    },
    relabel() {
      renderMadeBy();
      /* references are verbatim and untranslated; the OG card re-reads the
         document's live meta tags, which fillCopy has just updated */
      renderOgCard();
    },
    enter() {},
    leave() {},
    showFinalState() {},
  };
})();
