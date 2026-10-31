/* Sliding Puzzle BD \u2014 bilingual strings. Bengali strings are converted to
 * \uXXXX escapes at build time so pushed sources stay pure ASCII. */
(function (root) {
  'use strict';

  const STRINGS = {
    en: {
      title: 'Sliding Puzzle BD',
      tagline: 'Slide the tiles into order \u2014 1, 2, 3 \u2026 to the end.',
      sizeLabel: 'Board size',
      size3: '3 \u00d7 3 \u00b7 Easy',
      size4: '4 \u00d7 4 \u00b7 Classic',
      size5: '5 \u00d7 5 \u00b7 Hard',
      newGame: 'New Game',
      moves: 'Moves',
      time: 'Time',
      best: 'Best',
      bestNone: '\u2014',
      winTitle: 'You solved it!',
      winDetail: 'Solved in {moves} moves and {time}.',
      winBest: 'New best score!',
      playAgain: 'Play again',
      solvedOrder: 'Target order',
      howTitle: 'How to play',
      how1: 'Tap a tile next to the empty space to slide it in.',
      how2: 'Use the arrow keys (or WASD) to slide tiles too.',
      how3: 'Every shuffled board is guaranteed solvable.',
      langBtn: '\u09ac\u09be\u0982\u09b2\u09be',
      footer: 'Offline puzzle toy. No account, no network \u2014 your best scores stay on this device only.',
    },
    bn: {
      title: '\u09b8\u09cd\u09b2\u09be\u0987\u09a1\u09bf\u0982 \u09aa\u09be\u099c\u09b2 \u09ac\u09bf\u09a1\u09bf',
      tagline: '\u099f\u09be\u0987\u09b2\u0997\u09c1\u09b2\u09cb \u0995\u09cd\u09b0\u09ae\u09be\u09a8\u09c1\u09b8\u09be\u09b0\u09c7 \u09b8\u09be\u099c\u09be\u09a8 \u2014 \u09e7, \u09e8, \u09e9 \u2026 \u09b6\u09c7\u09b7 \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4\u0964',
      sizeLabel: '\u09ac\u09cb\u09b0\u09cd\u09a1\u09c7\u09b0 \u0986\u0995\u09be\u09b0',
      size3: '\u09e9 \u00d7 \u09e9 \u00b7 \u09b8\u09b9\u099c',
      size4: '\u09ea \u00d7 \u09ea \u00b7 \u0995\u09cd\u09b2\u09be\u09b8\u09bf\u0995',
      size5: '\u09eb \u00d7 \u09eb \u00b7 \u0995\u09a0\u09bf\u09a8',
      newGame: '\u09a8\u09a4\u09c1\u09a8 \u0996\u09c7\u09b2\u09be',
      moves: '\u099a\u09be\u09b2',
      time: '\u09b8\u09ae\u09af\u09bc',
      best: '\u09b8\u09c7\u09b0\u09be',
      bestNone: '\u2014',
      winTitle: '\u0986\u09aa\u09a8\u09bf \u09b8\u09ae\u09be\u09a7\u09be\u09a8 \u0995\u09b0\u09c7\u099b\u09c7\u09a8!',
      winDetail: '{moves} \u099a\u09be\u09b2\u09c7 \u098f\u09ac\u0982 {time} \u09b8\u09ae\u09af\u09bc\u09c7 \u09b8\u09ae\u09be\u09a7\u09be\u09a8 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964',
      winBest: '\u09a8\u09a4\u09c1\u09a8 \u09b8\u09c7\u09b0\u09be \u09b8\u09cd\u0995\u09cb\u09b0!',
      playAgain: '\u0986\u09ac\u09be\u09b0 \u0996\u09c7\u09b2\u09c1\u09a8',
      solvedOrder: '\u09b2\u0995\u09cd\u09b7\u09cd\u09af \u0995\u09cd\u09b0\u09ae',
      howTitle: '\u0995\u09c0\u09ad\u09be\u09ac\u09c7 \u0996\u09c7\u09b2\u09ac\u09c7\u09a8',
      how1: '\u09ab\u09be\u0981\u0995\u09be \u099c\u09be\u09af\u09bc\u0997\u09be\u09b0 \u09aa\u09be\u09b6\u09c7\u09b0 \u099f\u09be\u0987\u09b2\u09c7 \u099f\u09cd\u09af\u09be\u09aa \u0995\u09b0\u09b2\u09c7 \u09b8\u09c7\u099f\u09bf \u09b8\u09b0\u09c7 \u0986\u09b8\u09ac\u09c7\u0964',
      how2: '\u0985\u09cd\u09af\u09be\u09b0\u09cb \u0995\u09c0 (\u09ac\u09be WASD) \u09a6\u09bf\u09af\u09bc\u09c7\u0993 \u099f\u09be\u0987\u09b2 \u09b8\u09b0\u09be\u09a4\u09c7 \u09aa\u09be\u09b0\u09ac\u09c7\u09a8\u0964',
      how3: '\u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u098f\u09b2\u09cb\u09ae\u09c7\u09b2\u09cb \u09ac\u09cb\u09b0\u09cd\u09a1 \u09b8\u09ae\u09be\u09a7\u09be\u09a8\u09af\u09cb\u0997\u09cd\u09af \u2014 \u098f\u099f\u09be \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4\u0964',
      langBtn: 'English',
      footer: '\u0985\u09ab\u09b2\u09be\u0987\u09a8 \u09aa\u09be\u099c\u09b2 \u0996\u09c7\u09b2\u09be\u0964 \u0995\u09cb\u09a8\u09cb \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09ac\u09be \u09a8\u09c7\u099f\u0993\u09af\u09bc\u09be\u09b0\u09cd\u0995 \u09b2\u09be\u0997\u09c7 \u09a8\u09be \u2014 \u09b8\u09c7\u09b0\u09be \u09b8\u09cd\u0995\u09cb\u09b0 \u09b6\u09c1\u09a7\u09c1 \u098f\u0987 \u09a1\u09bf\u09ad\u09be\u0987\u09b8\u09c7\u0987 \u09a5\u09be\u0995\u09c7\u0964',
    },
  };

  const BN_DIGITS = ['\u09e6', '\u09e7', '\u09e8', '\u09e9', '\u09ea', '\u09eb', '\u09ec', '\u09ed', '\u09ee', '\u09ef'];

  function toBnDigits(value) {
    return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
  }

  function localize(value, lang) {
    return lang === 'bn' ? toBnDigits(value) : String(value);
  }

  const api = { STRINGS, toBnDigits, localize };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SlidingI18n = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
