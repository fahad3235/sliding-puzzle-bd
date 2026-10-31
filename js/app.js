/* Sliding Puzzle BD \u2014 UI wiring. Depends on SlidingLogic + SlidingI18n. */
(function () {
  'use strict';

  const L = window.SlidingLogic;
  const I18N = window.SlidingI18n;
  const STORE_LANG = 'sliding-puzzle-bd-lang';
  const STORE_BEST = 'sliding-puzzle-bd-best';

  const SHUFFLE_STEPS = { 3: 120, 4: 250, 5: 400 };

  let lang = 'en';
  try { lang = localStorage.getItem(STORE_LANG) || 'en'; } catch (e) {}
  if (lang !== 'en' && lang !== 'bn') lang = 'en';

  let best = {};
  try { best = JSON.parse(localStorage.getItem(STORE_BEST) || '{}'); } catch (e) { best = {}; }

  const state = {
    size: 4,
    board: [],
    moves: 0,
    startedAt: 0,
    elapsed: 0,
    timerId: null,
    won: false,
    isNewBest: false,
  };

  const $ = (id) => document.getElementById(id);

  function t(key) {
    return I18N.STRINGS[lang][key];
  }

  function loc(value) {
    return I18N.localize(value, lang);
  }

  function saveLang() {
    try { localStorage.setItem(STORE_LANG, lang); } catch (e) {}
  }

  function saveBest() {
    try { localStorage.setItem(STORE_BEST, JSON.stringify(best)); } catch (e) {}
  }

  function bestText() {
    const b = best[state.size];
    if (!b) return t('bestNone');
    return loc(b.moves) + ' ' + t('moves') + ' \u00b7 ' + loc(L.formatTime(b.seconds));
  }

  function stopTimer() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
  }

  function tick() {
    if (state.won || !state.startedAt) return;
    state.elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    $('timeVal').textContent = loc(L.formatTime(state.elapsed));
  }

  function startTimerIfNeeded() {
    if (state.startedAt || state.timerId) return;
    state.startedAt = Date.now();
    state.timerId = setInterval(tick, 500);
  }

  function newGame() {
    stopTimer();
    state.board = L.shuffleBoard(state.size, SHUFFLE_STEPS[state.size]);
    // A random walk can (rarely) land back on the solved board; reshuffle then.
    if (L.isSolved(state.board)) {
      state.board = L.shuffleBoard(state.size, SHUFFLE_STEPS[state.size]);
    }
    state.moves = 0;
    state.startedAt = 0;
    state.elapsed = 0;
    state.won = false;
    state.isNewBest = false;
    $('winBanner').hidden = true;
    render();
  }

  function checkWin() {
    if (!state.won && L.isSolved(state.board)) {
      state.won = true;
      stopTimer();
      const seconds = state.elapsed;
      const prev = best[state.size];
      if (!prev || state.moves < prev.moves ||
          (state.moves === prev.moves && seconds < prev.seconds)) {
        best[state.size] = { moves: state.moves, seconds: seconds };
        state.isNewBest = true;
        saveBest();
      }
      $('winDetail').textContent = t('winDetail')
        .replace('{moves}', loc(state.moves))
        .replace('{time}', loc(L.formatTime(seconds)));
      $('winBest').hidden = !state.isNewBest;
      $('winBanner').hidden = false;
      renderStats();
    }
  }

  function applyMove(nextBoard) {
    if (!nextBoard || state.won) return;
    startTimerIfNeeded();
    state.board = nextBoard;
    state.moves++;
    render();
    checkWin();
  }

  function onTileClick(idx) {
    applyMove(L.move(state.board, state.size, idx));
  }

  function onKey(e) {
    const map = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
      W: 'up', S: 'down', A: 'left', D: 'right',
    };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    applyMove(L.moveBlank(state.board, state.size, dir));
  }

  function renderStats() {
    $('movesVal').textContent = loc(state.moves);
    $('timeVal').textContent = loc(L.formatTime(state.elapsed));
    $('bestVal').textContent = bestText();
  }

  function render() {
    const n = state.size;
    const grid = $('board');
    grid.style.setProperty('--n', n);
    grid.innerHTML = '';
    state.board.forEach((value, idx) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = value === 0 ? 'tile blank' : 'tile';
      cell.textContent = value === 0 ? '' : loc(value);
      cell.setAttribute('aria-label', value === 0 ? 'empty space' : 'tile ' + value);
      if (value !== 0) {
        cell.addEventListener('click', () => onTileClick(idx));
      }
      grid.appendChild(cell);
    });
    renderStats();
  }

  function renderStatic() {
    document.title = t('title');
    $('title').textContent = t('title');
    $('tagline').textContent = t('tagline');
    $('sizeLabel').textContent = t('sizeLabel');
    $('newGameBtn').textContent = t('newGame');
    $('movesLabel').textContent = t('moves');
    $('timeLabel').textContent = t('time');
    $('bestLabel').textContent = t('best');
    $('winTitle').textContent = t('winTitle');
    $('winBest').textContent = t('winBest');
    $('playAgainBtn').textContent = t('playAgain');
    $('solvedLabel').textContent = t('solvedOrder');
    $('howTitle').textContent = t('howTitle');
    $('how1').textContent = t('how1');
    $('how2').textContent = t('how2');
    $('how3').textContent = t('how3');
    $('langBtn').textContent = t('langBtn');
    $('footer').textContent = t('footer');
    $('size3Btn').textContent = t('size3');
    $('size4Btn').textContent = t('size4');
    $('size5Btn').textContent = t('size5');
    document.querySelectorAll('.size-btn').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.size) === state.size);
    });
    const preview = $('solvedPreview');
    preview.innerHTML = '';
    for (let i = 1; i < state.size * state.size; i++) {
      const span = document.createElement('span');
      span.className = 'mini';
      span.textContent = loc(i);
      preview.appendChild(span);
    }
    const blank = document.createElement('span');
    blank.className = 'mini blank';
    preview.appendChild(blank);
  }

  function setSize(n) {
    state.size = n;
    renderStatic();
    newGame();
  }

  function toggleLang() {
    lang = lang === 'en' ? 'bn' : 'en';
    saveLang();
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    renderStatic();
    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    $('newGameBtn').addEventListener('click', newGame);
    $('playAgainBtn').addEventListener('click', newGame);
    $('langBtn').addEventListener('click', toggleLang);
    document.querySelectorAll('.size-btn').forEach((btn) => {
      btn.addEventListener('click', () => setSize(Number(btn.dataset.size)));
    });
    document.addEventListener('keydown', onKey);
    renderStatic();
    newGame();
  });

  // Test hook for the headless smoke suite (documented in TEST_RESULTS.md).
  window.__puzzle = {
    get state() { return state; },
    move: (idx) => applyMove(L.move(state.board, state.size, idx)),
    newGame,
    setSize,
    render,
  };
})();
