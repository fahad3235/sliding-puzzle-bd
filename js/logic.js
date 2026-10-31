/* Sliding Puzzle BD \u2014 pure game logic. No DOM, no storage: unit-testable in Node.
 * Board: flat array of length n*n; numbers 1..n*n-1 plus 0 for the blank.
 * Solved board: [1, 2, ..., n*n-1, 0].
 */
(function (root) {
  'use strict';

  function solvedBoard(n) {
    const b = [];
    for (let i = 1; i < n * n; i++) b.push(i);
    b.push(0);
    return b;
  }

  function blankIndex(board) {
    return board.indexOf(0);
  }

  function isSolved(board) {
    for (let i = 0; i < board.length - 1; i++) {
      if (board[i] !== i + 1) return false;
    }
    return board[board.length - 1] === 0;
  }

  function isAdjacent(board, n, idx) {
    const blank = blankIndex(board);
    const r1 = Math.floor(idx / n), c1 = idx % n;
    const r2 = Math.floor(blank / n), c2 = blank % n;
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }

  // Returns a NEW board with the tile at idx slid into the blank, or null
  // when the tile is not adjacent to the blank.
  function move(board, n, idx) {
    if (!isAdjacent(board, n, idx)) return null;
    const next = board.slice();
    const blank = blankIndex(board);
    next[blank] = next[idx];
    next[idx] = 0;
    return next;
  }

  // Move the blank one step in a direction ('up'|'down'|'left'|'right').
  // Returns a NEW board or null when the blank cannot move that way.
  function moveBlank(board, n, dir) {
    const blank = blankIndex(board);
    const r = Math.floor(blank / n), c = blank % n;
    let target = -1;
    if (dir === 'up' && r + 1 < n) target = blank + n;
    if (dir === 'down' && r - 1 >= 0) target = blank - n;
    if (dir === 'left' && c + 1 < n) target = blank + 1;
    if (dir === 'right' && c - 1 >= 0) target = blank - 1;
    if (target < 0) return null;
    return move(board, n, target);
  }

  function inversions(board) {
    const tiles = board.filter((v) => v !== 0);
    let inv = 0;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] > tiles[j]) inv++;
      }
    }
    return inv;
  }

  // Row of the blank counted from the bottom (1-based).
  function blankRowFromBottom(board, n) {
    const r = Math.floor(blankIndex(board) / n);
    return n - r;
  }

  // Classic solvability rule. Odd grid width: solvable iff inversions even.
  // Even grid width: solvable iff (blank on even row from bottom AND
  // inversions odd) OR (blank on odd row from bottom AND inversions even).
  function isSolvable(board, n) {
    const inv = inversions(board);
    if (n % 2 === 1) return inv % 2 === 0;
    const rowFromBottom = blankRowFromBottom(board, n);
    if (rowFromBottom % 2 === 0) return inv % 2 === 1;
    return inv % 2 === 0;
  }

  // Shuffle by a random walk from the solved state, so the result is
  // ALWAYS solvable (no parity lottery, no unsolvable boards ever).
  // `rand` is injectable for deterministic tests.
  function shuffleBoard(n, steps, rand) {
    const rnd = rand || Math.random;
    let board = solvedBoard(n);
    let prevBlank = -1;
    for (let s = 0; s < steps; s++) {
      const blank = blankIndex(board);
      const r = Math.floor(blank / n), c = blank % n;
      const options = [];
      if (r > 0) options.push(blank - n);
      if (r < n - 1) options.push(blank + n);
      if (c > 0) options.push(blank - 1);
      if (c < n - 1) options.push(blank + 1);
      const candidates = options.filter((t) => t !== prevBlank);
      const pick = candidates[Math.floor(rnd() * candidates.length)];
      prevBlank = blank;
      board = move(board, n, pick);
    }
    return board;
  }

  function isPermutation(board, n) {
    if (board.length !== n * n) return false;
    const seen = new Array(n * n).fill(false);
    for (const v of board) {
      if (v < 0 || v >= n * n || seen[v]) return false;
      seen[v] = true;
    }
    return true;
  }

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  const api = {
    solvedBoard, blankIndex, isSolved, isAdjacent, move, moveBlank,
    inversions, blankRowFromBottom, isSolvable, shuffleBoard,
    isPermutation, formatTime,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SlidingLogic = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
