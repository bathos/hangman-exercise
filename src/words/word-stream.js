const { Writable } = require('stream');

// Our data comes from https://github.com/first20hours/google-10000-english,
// specifically the list of medium-length words minus swears. This list is
// already only words under 10 characters long, but to keep the game from being
// overly difficult (i.e., it needs to be okay to make a bad guess or two),
// we’ll filter it further to only include words with a maximum of six unique
// characters, which ‘leaves room’ for more bad guesses per game.

const LF = 0x0A;
const MAX_UNIQUE_CHARACTERS = 6;

// Process file stream, extracting a list of words meeting our criteria. This
// can be kept simple because:
//
//  (a) we know all input is ASCII-range characters and
//  (b) the only whitespace is all single LFs and
//  (c) there is a terminal LF, so we don’t need flush logic

module.exports = class WordStream extends Writable {
  constructor() {
    super();
    this.words = [];

    this.on('finish', () => this.emit('words', this.words));
  }

  _write(chunk, enc, done) {
    const buffer = this.reserved
      ? Buffer.concat(this.reserved, chunk)
      : chunk;

    const reserved = [];

    for (const byte of buffer) {
      if (byte !== LF) {
        reserved.push(byte);
      } else if (reserved.length) {

        if (new Set(reserved).size <= MAX_UNIQUE_CHARACTERS) {
          this.words.push(String.fromCodePoint(...reserved));
        }

        reserved.length = 0;
      }
    }

    this.reserved = reserved.length && reserved;

    done();
  }
}
