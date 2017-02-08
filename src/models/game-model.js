const initRandomWords = require('../words/random-words');
const getUUID = require('uuid/v4');

// I’m not hooking up a real DB here, but I’ll follow a pattern as if I were for
// the sake of demonstration. The ‘database’ will be faked in memory as a Map
// below and we will pretend all access needs to be async.

const MAX_BAD_GUESSES = 10;
const VALID_CHARS = new Set('abcdefghijklmnopqrstuvwxyz');

const areValidGuesses = guesses =>
  guesses instanceof Array &&
  guesses.every(char => VALID_CHARS.has(char)) &&
  new Set(guesses).size === guesses.length;

const areValidGuessesUpdate = (newGuesses, oldGuesses) =>
  newGuesses.length >= oldGuesses.length &&
  newGuesses.length <= oldGuesses.length + 1 &&
  oldGuesses.every((char, index) => char === newGuesses[index]);

module.exports = () => {
  const mockDB = new Map();
  const getRandomWord = initRandomWords();

  return class Game {
    constructor() {
      this.guesses = [];

      // Provided via `create`, which ‘saves’ the new game:
      // - this.id
      // - this.word
    }

    static create() {
      const game = new this();

      game.id = getUUID();

      return getRandomWord().then(word => {
        game.word = word;

        mockDB.set(game.id, game);

        return game;
      });
    }

    static findById(id) {
      return new Promise((resolve, reject) => {
        const game = mockDB.get(id);

        if (!game) {
          reject(Object.assign(new Error('Game not found'), {
            status: 404
          }));
        } else {
          resolve(game);
        }
      });
    }

    static update(update) {
      if (!update || !update.id) {
        throw new Error('Cannot update game without ID');
      }

      return this.findById(update.id).then(game => {
        if (game.won || game.lost) {
          throw Object.assign(new Error('Finished game cannot be updated'), {
            status: 400
          });
        }

        const priorGuesses = game.guesses;
        const newGuesses = update.guesses;

        // game.guesses is the only property which we permit users to update.
        // Whether to consider the inclusion of other properties which cannot be
        // updated to be an error is a question that depends on the kinds of
        // consumers an API has. In our case, we will simply ignore any noise
        // and consider such an update successful.

        if (newGuesses === undefined) {
          return game;
        }

        if (!areValidGuesses(newGuesses)) {
          throw Object.assign(
            new Error(
              `Malformed request: expected game.guesses, if present, to be ` +
              `an array of single, unique chars (a-z). Got ${ newGuesses }.`
            ), {
              status: 400
            }
          );
        }

        if (!areValidGuessesUpdate(newGuesses, priorGuesses)) {
          throw Object.assign(
            new Error(
              'Malformed request: game.guesses cannot remove or alter prior ' +
              'guesses and must not included more guesses than are permitted ' +
              'by game rules.'
            ), {
              status: 400
            }
          );
        }

        game.guesses = newGuesses;

        return game;
      });
    }

    get badGuessCount() {
      const expectedChars = new Set(this.word);
      return this.guesses.filter(char => !expectedChars.has(char)).length;
    }

    get lost() {
      return !this.won && this.badGuessCount >= MAX_BAD_GUESSES;
    }

    get remainingGuessCount() {
      return MAX_BAD_GUESSES - this.badGuessCount;
    }

    get won() {
      const expectedChars = new Set(this.word);
      const matchedChars = this.guesses.filter(char => expectedChars.has(char));

      return matchedChars.length === expectedChars.size;
    }

    get wordMask() {
      const guessedChars = new Set(this.guesses);

      return Array
        .from(this.word)
        .map(char => guessedChars.has(char) ? char : '_')
        .join('');
    }

    toPublicView() {
      return {
        badGuessCount:       this.badGuessCount,
        guesses:             this.guesses,
        id:                  this.id,
        lost:                this.lost,
        remainingGuessCount: this.remainingGuessCount,
        won:                 this.won,
        word:                this.won || this.lost ? this.word : undefined,
        wordMask:            this.wordMask
      };
    }
  };
};
