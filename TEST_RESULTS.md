# TEST RESULTS — sliding-puzzle-bd (Factory run #199, 2026-10-31 18:00 slot)

## Node unit tests — 9/9 passed

Command: `node tests/logic.test.js`

- Solved-board detection for 3×3, 4×4, 5×5; one non-solved board rejected.
- Adjacent tile slides into the blank; non-adjacent tiles rejected; input
  board not mutated (pure function).
- `moveBlank` directions and walls on a solved 4×4 (blank corner: up/left
  blocked; down/right produce the exact expected boards).
- Solvability rule matches textbook cases: solved 4×4 solvable; the classic
  14–15 swap unsolvable (inversions = 1); odd-width inversion-parity cases.
- Shuffle: 40 seeded shuffles per size (3×3, 4×4, 5×5) are all valid
  permutations, all solvable, none accidentally solved.
- Deterministic shuffle: same seed reproduces the same board.
- One-move-away board returns to solved with the reverse move.
- `formatTime` (0 → 0:00, 65 → 1:05, 600 → 10:00) and
  `blankRowFromBottom` (solved 4×4 → 1; top-left blank 3×3 → 3).

Repairs during testing (all test-side or spec corrections, 0 app-logic bugs
in the final code): one test expectation corrected (index 4 IS vertically
adjacent to the blank at index 7); one `moveBlank('down')` expectation
corrected (tile 12 lands at index 15, blank at 11); WASD mapping fixed in
the app (A = left, D = right, matching the arrow keys).

## Headless-Chrome smoke — 14/14 passed

Command: `node smoke.mjs` (raw CDP, /opt/meta-chromium/chrome, file://)

- Title renders; default 4×4 board has 16 cells forming a valid permutation
  of 1–15 + blank; moves start at 0; win banner hidden at start.
- Clicking an adjacent tile moves it (moves 0 → 1); clicking a
  non-adjacent tile does nothing (moves stay 1).
- Size switch to 3×3 renders 9 cells and resets moves to 0.
- Scripted win: a one-move-away board (tile 6 slid down, blank at 5) is
  injected via the `window.__puzzle` test hook, re-rendered, and the
  completing tile is clicked in the real UI — the win banner appears with
  moves = 8.
- বাংলা toggle switches the title to Bengali and renders Bengali digits.
- 390 px mobile: no horizontal overflow.
- Zero console errors / exceptions.

The `window.__puzzle` hook (state, move, newGame, setSize, render) exists
solely for this smoke suite and is documented here; it changes no gameplay.

## Source hygiene

- Pushed sources are pure ASCII (Bengali in `js/i18n.js` stored as
  `\uXXXX` escapes; verified with `grep -P '[^\x00-\x7F]'` = zero matches
  across js/, index.html, style.css, tests/).
- `smoke.mjs` (local QA harness, contains Bengali test literals) is NOT
  part of the pushed repo.
- Zero network requests by design (static files only, no CDN).

## Publish verification

- Repo: https://github.com/fahad3235/sliding-puzzle-bd (PUBLIC)
- Live site: https://fahad3235.github.io/sliding-puzzle-bd/ (GitHub Pages,
  main branch, root — verified 2026-10-31 ~18:20 +06: HTTP 200 after the
  build finished, live index.html byte-identical to local, live js/css
  all 200, Bengali escapes intact)
