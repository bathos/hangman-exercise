const crypto      = require('crypto');
const getWordList = require('./get-word-list');

// We won’t really return a random word. Instead, we’ll randomize the list and
// return the items in the new order. This will be perceived as more random
// since you are guaranteed not to get the same word again until all others have
// been exhausted (naturally this effect diminishes with the number of users,
// but it doesn’t seem worth it to make the list per-session for this exercise.)

const randomWordGen = function * (words) {
  while (true) {
    const indices = crypto.randomBytes(words.length);

    const pool = words
      .map((word, index) => [ indices[index], word ])
      .sort(([ a ], [ b ]) => a < b ? -1 : Boolean(a > b))
      .map(([ , word ]) => word);

    for (const word of pool) {
      yield word;
    }
  }
};

module.exports = () => {
  const randomWordIter = getWordList().then(randomWordGen);
  return () => randomWordIter.then(iter => iter.next().value);
};
