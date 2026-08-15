/* s0-generate.js — screen 0: "Generate" (BUILD-SPEC §6, screen 0).

   A typewriter types the prompt at ~40 ms/char, a [ Generate ] button fades
   up and breathes, and on click (or auto-start at 8 s) a 6.2-second
   choreographed sequence assembles the mock page in five stages of ~1.2 s:
   skeleton → type → colour → media → settle. State classes accumulate on
   the section; the Web Animations API staggers the skeleton blocks.

   The timer counts REAL elapsed time and freezes at whatever it reads —
   the sequence is designed to land near 6.2 s, not the number faked. */
(function () {
  'use strict';
  window.SCREENS = window.SCREENS || {};

  const STAGE = 1200;
  const TYPE_MS = 40;

  const state = { typed: false, started: false, finished: false };
  let ctx, root, promptTextEl, timerValEl;
  let typeTimer = 0, autoTimer = 0, timerRaf = 0;
  let stageTimers = [];

  function blocksInOrder() {
    return Array.prototype.slice.call(
      root.querySelectorAll('.mock-logo, .mock-navlinks i, .mock-line, .mock-cta, .mock-img')
    );
  }

  function stopTyping() {
    clearInterval(typeTimer);
    typeTimer = 0;
  }

  function typePrompt() {
    const text = ctx.t('s0.promptText');
    /* the placeholder shows dim for a beat, then typing replaces it */
    promptTextEl.classList.add('is-placeholder');
    promptTextEl.textContent = ctx.t('s0.promptPlaceholder');

    stageTimers.push(setTimeout(function () {
      promptTextEl.classList.remove('is-placeholder');
      promptTextEl.textContent = '';
      let i = 0;
      typeTimer = setInterval(function () {
        i += 1;
        promptTextEl.textContent = text.slice(0, i);
        if (i >= text.length) {
          stopTyping();
          state.typed = true;
          armButton();
        }
      }, TYPE_MS);
    }, 900));
  }

  function armButton() {
    root.classList.add('ready');
    /* not clicked within 8 s → start on its own (§5) */
    autoTimer = setTimeout(function () {
      startSequence();
    }, 8000);
  }

  function startTimer() {
    const t0 = performance.now();
    root.querySelector('.gen-timer').hidden = false;
    function tick(now) {
      timerValEl.textContent = ((now - t0) / 1000).toFixed(1) + 's';
      timerRaf = requestAnimationFrame(tick);
    }
    timerRaf = requestAnimationFrame(tick);
  }

  function freezeTimer() {
    cancelAnimationFrame(timerRaf);
    root.querySelector('.gen-done').hidden = false;
  }

  function startSequence() {
    if (state.started) return;
    state.started = true;
    clearTimeout(autoTimer);
    if (!state.typed) {
      /* auto-start raced the typewriter (only possible on a language
         switch mid-type): settle the prompt first */
      stopTyping();
      promptTextEl.textContent = ctx.t('s0.promptText');
      state.typed = true;
    }

    root.classList.remove('ready');
    root.classList.add('generating');
    startTimer();

    /* stage 1 — skeleton: blocks fade in with a 60 ms stagger */
    blocksInOrder().forEach(function (b, i) {
      b.animate(
        { opacity: [0, 1], transform: ['translateY(7px)', 'translateY(0)'] },
        { duration: 420, delay: i * 60, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }
      );
    });

    /* stage 2 — type: the headline block becomes real text */
    stageTimers.push(setTimeout(function () { root.classList.add('typed'); }, STAGE));
    /* stage 3 — colour: ink flips to paper; --signal appears once */
    stageTimers.push(setTimeout(function () { root.classList.add('lit'); }, STAGE * 2));
    /* stage 4 — media: gradient-and-noise fills fade into the blocks */
    stageTimers.push(setTimeout(function () { root.classList.add('media-on'); }, STAGE * 3));
    /* stage 5 — settle */
    stageTimers.push(setTimeout(function () {
      root.classList.add('settled');
      const page = root.querySelector('.mock-page');
      page.animate(
        { transform: ['scale(1.012)', 'scale(1)'] },
        { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
    }, STAGE * 4));

    /* finish — freeze the timer at what it really reads (≈6.2 s) */
    stageTimers.push(setTimeout(function () {
      state.finished = true;
      root.classList.add('done');
      root.querySelector('.scroll-cue').hidden = false;
      freezeTimer();
    }, 6200));
  }

  SCREENS.s0 = {
    build(c) {
      ctx = c;
      root = document.getElementById('s0');
      promptTextEl = root.querySelector('.prompt-text');
      timerValEl = root.querySelector('.gen-timer-value');
      promptTextEl.removeAttribute('data-copy'); /* the typewriter owns it */
      promptTextEl.textContent = '';
      root.querySelector('.prompt-box').setAttribute('aria-label', ctx.t('s0.promptPlaceholder'));
      root.querySelector('.gen-btn').addEventListener('click', function () {
        clearTimeout(autoTimer);
        startSequence();
      });
    },

    relabel() {
      root.querySelector('.prompt-box').setAttribute('aria-label', ctx.t('s0.promptPlaceholder'));
      if (state.typed || state.started) {
        stopTyping();
        promptTextEl.classList.remove('is-placeholder');
        promptTextEl.textContent = ctx.t('s0.promptText');
      }
    },

    enter() {
      typePrompt();
    },

    leave() {
      clearTimeout(autoTimer);
    },

    showFinalState() {
      stopTyping();
      stageTimers.forEach(clearTimeout);
      clearTimeout(autoTimer);
      state.typed = state.started = state.finished = true;
      promptTextEl.classList.remove('is-placeholder');
      promptTextEl.textContent = ctx.t('s0.promptText');
      ['generating', 'typed', 'lit', 'media-on', 'settled', 'done'].forEach(function (cls) {
        root.classList.add(cls);
      });
      root.classList.remove('ready');
      root.querySelector('.gen-timer').hidden = false;
      root.querySelector('.scroll-cue').hidden = false;
      /* the spec asks for the timer to read 6.2s in the motionless path */
      timerValEl.textContent = '6.2s';
      root.querySelector('.gen-done').hidden = false;
    },
  };
})();
