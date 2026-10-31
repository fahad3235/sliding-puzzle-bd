/* Node unit tests for Sliding Puzzle BD logic. Run: node tests/logic.test.js */
'use strict';
const assert = require('node:assert');
const L = require('../js/logic.js');

let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  console.log('  OK ' + name);
}

// --- solved detection ---
check('solved board detected for 3x3 and 4x4', () => {
  assert.strictEqual(L.isSolved(L.solvedBoard(3)), true);
  assert.strictEqual(L.isSolved(L.solvedBoard(4)), true);
  assert.strictEqual(L.isSolved(L.solvedBoard(5)), true);
  assert.strictEqual(L.isSolved([1, 2, 3, 4, 5, 6, 7, 0, 8]), false);
});

// --- adjacency + move ---
check('adjacent tile slides into blank; non-adjacent rejected', () => {
  const b = [1, 2, 3, 4, 5, 6, 7, 0, 8]; // blank at 7
  const moved = L.move(b, 3, 8);
  assert.deepStrictEqual(moved, [1, 2, 3, 4, 5, 6, 7, 8, 0]);
  assert.strictEqual(L.move(b, 3, 0), null); // corner, not adjacent
  assert.strictEqual(L.move(b, 3, 2), null); // Manhattan distance 2
  assert.deepStrictEqual(L.move(b, 3, 4), [1, 2, 3, 4, 0, 6, 7, 5, 8]); // vertical neighbour
  assert.strictEqual(L.isSolved(moved), true);
  assert.deepStrictEqual(b, [1, 2, 3, 4, 5, 6, 7, 0, 8]); // input untouched
});

check('moveBlank directions and walls', () => {
  const b = L.solvedBoard(4); // blank at 15 (bottom-right)
  assert.strictEqual(L.moveBlank(b, 4, 'up'), null); // blank cannot go up (no row below)
  assert.strictEqual(L.moveBlank(b, 4, 'left'), null);
  const down = L.moveBlank(b, 4, 'down');
  assert.deepStrictEqual(down.slice(11, 16), [0, 13, 14, 15, 12]);
  const right = L.moveBlank(b, 4, 'right');
  assert.deepStrictEqual(right.slice(12, 16), [13, 14, 0, 15]);
});

// --- solvability rule: textbook cases ---
check('solvability rule matches textbook cases', () => {
  assert.strictEqual(L.isSolvable(L.solvedBoard(4), 4), true);
  // Classic unsolvable 15-puzzle: only 14 and 15 swapped.
  const swapped = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0];
  assert.strictEqual(L.isSolvable(swapped, 4), false);
  assert.strictEqual(L.inversions(swapped), 1);
  // Odd width: inversions even => solvable.
  assert.strictEqual(L.isSolvable([1, 2, 3, 4, 5, 6, 8, 7, 0], 3), false);
  assert.strictEqual(L.isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 0], 3), true);
});

// --- shuffle: always solvable, valid permutation, never solved ---
check('shuffle is always solvable and a valid permutation (all sizes)', () => {
  let seed = 123456789;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (const n of [3, 4, 5]) {
    for (let i = 0; i < 40; i++) {
      const b = L.shuffleBoard(n, 200, rand);
      assert.strictEqual(L.isPermutation(b, n), true, 'permutation ' + n);
      assert.strictEqual(L.isSolvable(b, n), true, 'solvable ' + n);
      assert.strictEqual(L.isSolved(b), false, 'not solved ' + n);
    }
  }
});

check('deterministic shuffle with same seed', () => {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const a = L.shuffleBoard(4, 50, rand);
  seed = 42;
  const b2 = L.shuffleBoard(4, 50, rand);
  assert.deepStrictEqual(a, b2);
});

// --- one-move win round trip ---
check('one move away from solved, then back, is solved', () => {
  const oneAway = L.moveBlank(L.solvedBoard(4), 4, 'down'); // 15 slides down
  assert.strictEqual(L.isSolved(oneAway), false);
  const back = L.moveBlank(oneAway, 4, 'up');
  assert.strictEqual(L.isSolved(back), true);
});

// --- helpers ---
check('formatTime', () => {
  assert.strictEqual(L.formatTime(0), '0:00');
  assert.strictEqual(L.formatTime(65), '1:05');
  assert.strictEqual(L.formatTime(600), '10:00');
});

check('blankRowFromBottom', () => {
  assert.strictEqual(L.blankRowFromBottom(L.solvedBoard(4), 4), 1);
  assert.strictEqual(L.blankRowFromBottom([0, 1, 2, 3, 4, 5, 6, 7, 8], 3), 3);
});

console.log(passed + ' unit checks passed');
