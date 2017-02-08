// Please forgive the lack of modularization — to keep this simple I avoided
// having any build process.

// RENDERING ///////////////////////////////////////////////////////////////////

const SVG_NS = 'http://www.w3.org/2000/svg';

const createLine = (x1, x2, y1, y2) => {
  const line = document.createElementNS(SVG_NS, 'line');

  line.setAttribute('x1', x1);
  line.setAttribute('x2', x2);
  line.setAttribute('y1', y1);
  line.setAttribute('y2', y2);

  return line;
};

const getRenderHangman = parent => {
  const sky         = document.createElement('div');
  const hangman     = document.createElementNS(SVG_NS, 'svg');
  const gallows     = document.createElementNS(SVG_NS, 'g');
  const hangmanBody = document.createElementNS(SVG_NS, 'g');

  sky.classList.add('sky');
  hangman.classList.add('hangman');
  hangmanBody.classList.add('hangman-body');

  hangman.setAttribute('viewBox', '0 0 200 300');

  const gallowsBase     = createLine(  0, 200, 295, 295);
  const gallowsPole     = createLine( 45,  45,  75, 285);
  const gallowsBeam     = createLine( 55, 135,  75,  75);
  const hangmanTorso    = createLine(130, 130, 143, 200);
  const hangmanLeftArm  = createLine( 95, 125, 175, 150);
  const hangmanRightArm = createLine(135, 165, 150, 175);
  const hangmanLeftLeg  = createLine( 95, 128, 250, 205);
  const hangmanRightLeg = createLine(133, 165, 205, 250);
  const noose           = createLine(130, 130,  82, 110);

  const hangmanHead = document.createElementNS(SVG_NS, 'circle');

  hangmanHead.setAttribute('cx', 130);
  hangmanHead.setAttribute('cy', 120);
  hangmanHead.setAttribute('r',   15);

  hangmanLeftArm.classList.add('arm', 'left');
  hangmanRightArm.classList.add('arm', 'right');
  noose.classList.add('noose');

  const parts = [
    gallowsBase,
    gallowsPole,
    gallowsBeam,
    hangmanHead,
    hangmanTorso,
    hangmanLeftArm,
    hangmanRightArm,
    hangmanLeftLeg,
    hangmanRightLeg,
    noose
  ];

  gallows.appendChild(gallowsBase);
  gallows.appendChild(gallowsPole);
  gallows.appendChild(gallowsBeam);
  gallows.appendChild(noose);

  hangmanBody.appendChild(hangmanHead);
  hangmanBody.appendChild(hangmanTorso);
  hangmanBody.appendChild(hangmanLeftArm);
  hangmanBody.appendChild(hangmanRightArm);
  hangmanBody.appendChild(hangmanLeftLeg);
  hangmanBody.appendChild(hangmanRightLeg);

  parts.forEach(part => {
    part.classList.add('hangman-component');
    part.style.opacity = 0;
  });

  hangman.appendChild(gallows);
  hangman.appendChild(hangmanBody);
  sky.appendChild(hangman);
  parent.appendChild(sky);

  return ({ game: { badGuessCount, won } }) => {
    if (won) {
      sky.classList.add('dawn');
      return;
    }

    sky.classList.remove('dawn');

    parts.slice(0, badGuessCount).forEach(part => {
      part.style.opacity = 1;
    });

    parts.slice(badGuessCount).forEach(part => {
      part.style.opacity = 0;
    });

    if (badGuessCount === parts.length) {
      hangmanBody.classList.add('hanged');
      sky.classList.add('twilight');
    } else {
      hangmanBody.classList.remove('hanged');
      sky.classList.remove('twilight');
    }
  };
};

const getRenderInstructions = parent => {
  const instructions = document.createElement('p');

  instructions.classList.add('instructions');

  instructions.textContent = `
    Guess a character by typing it.
    Press ESCAPE to get a new game.
    Make fewer than ten bad guesses or a man will die.
  `;

  parent.appendChild(instructions);

  return () => undefined;
};

const getRenderPlayStats = parent => {
  const playStats = document.createElement('div');

  playStats.classList.add('play-stats');

  parent.appendChild(playStats);

  return ({ gamesPlayed, gamesWon }) => {
    playStats.textContent = `Won ${ gamesWon } of ${ gamesPlayed }.`;
  };
};

const getRenderStatus = parent => {
  const status    = document.createElement('p');
  const prefix    = document.createElement('span');
  const remaining = document.createTextNode('');
  const suffix    = document.createElement('span');
  const endMsg    = document.createElement('span');

  status.classList.add('status');

  prefix.textContent = 'You have ';
  suffix.textContent = ' remaining guesses.';

  endMsg.style.display = 'none';
  endMsg.textContent = ' Press ESC to try again.';

  status.appendChild(prefix);
  status.appendChild(remaining);
  status.appendChild(suffix);
  status.appendChild(endMsg);

  parent.appendChild(status);

  return ({ game: { remainingGuessCount, won } }) => {
    if (won) {
      prefix.style.display  = 'none';
      suffix.style.display  = 'none';
      remaining.textContent = 'You won! ';
      endMsg.style.display  = 'inline';
    } else {
      prefix.style.display    = '';
      remaining.textContent   = remainingGuessCount;
      suffix.style.display    = '';
      endMsg.style.display    = remainingGuessCount ? 'none' : 'inline';
    }
  };
};

const getRenderUsedChars = parent => {
  const guessList = document.createElement('ul');

  guessList.classList.add('guesses');

  const charsEntries = Array.from('abcdefghijklmnopqrstuvwxyz').map(char => {
    const li = document.createElement('li');

    li.textContent = char.toUpperCase();

    guessList.appendChild(li);

    return [ char, li ];
  });

  parent.appendChild(guessList);

  return ({ game: { guesses } }) => {
    for (const [ char, li ] of charsEntries) {
      if (guesses.includes(char)) {
        li.classList.add('guessed');
      } else {
        li.classList.remove('guessed');
      }
    }
  };
};

const getRenderWord = parent => {
  const wordMatch = document.createElement('div');

  wordMatch.classList.add('word');

  parent.appendChild(wordMatch);

  return ({ game: { word, wordMask } }) => {
    if (word) {
      Array
        .from(wordMatch.childNodes)
        .forEach(node => wordMatch.removeChild(node));

      Array
        .from(word)
        .map(char => {
          const span = document.createElement('span');

          span.textContent = char;

          if (!wordMask.includes(char)) {
            span.classList.add('unguessed');
          }

          return span;
        }).forEach(span => {
          wordMatch.appendChild(span);
        });
    } else {
      wordMatch.textContent = wordMask;
    }
  };
};

// INIT ////////////////////////////////////////////////////////////////////////

const init = () => {

  // API requests

  const baseOpts = {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  };

  const getOpts = (method, body) => Object.assign({}, baseOpts, {
    body: body && JSON.stringify(body),
    method
  });

  const getGame = id =>
    fetch(`/games/${ id }`, getOpts('GET'));

  const getNewGame = () =>
    fetch('/games', getOpts('POST')).then(res => {
      if (!res.error) {
        state.gamesPlayed++;
      }

      return res;
    });

  const getStatus = () =>
    fetch('/status', getOpts('GET'));

  const updateGame = game =>
    fetch(`/games/${ game.id }`, getOpts('PATCH', game));

  // Events

  const KEY_ESCAPE = 0x1B;
  const KEY_A      = 0x41;
  const KEY_Z      = 0x5A;

  const isKeyCombo = event =>
    event.altKey ||
    event.ctrlKey ||
    event.metaKey;

  document.addEventListener('keydown', event => {
    if (isKeyCombo(event) || state.pending) {
      return;
    }

    const { keyCode } = event;

    if (keyCode === KEY_ESCAPE) {
      getNewGame().then(handleRes).then(render);
      return;
    }

    if (state.game.won || state.game.lost) {
      return;
    }

    if (keyCode >= KEY_A && keyCode <= KEY_Z) {
      const char = String.fromCodePoint(keyCode).toLowerCase();

      if (state.game.guesses.includes(char)) {
        return;
      }

      state.game.guesses.push(char);

      state.pending = true;

      updateGame(state.game)
        .then(handleRes)
        .then(() => {
          if (state.game.won) {
            state.gamesWon++;
          }
        })
        .then(render);;
    }
  });

  // Render

  const fragment = document.createDocumentFragment();

  const renderFns = [
    getRenderHangman,
    getRenderWord,
    getRenderStatus,
    getRenderUsedChars,
    getRenderPlayStats,
    getRenderInstructions
  ].map(getRender => getRender(fragment));

  const render = () =>
    renderFns.forEach(render => render(state));

  document.body.appendChild(fragment);

  // State

  const state = {
    game: {},
    pending: true
  };

  const handleRes = res => res.json()
    .then(game => {
      if (game.error) {
        throw new Error(game.error);
      }

      state.game = game;
    })
    .catch(err => alert(`Oh poop: ${ err.message }`))
    .then(() => state.pending = false);

  getStatus()
    .then(res => res.json())
    .then(status => {
      if (status.error) {
        throw new Error(status.error);
      }

      state.gamesWon = status.gamesWon;
      state.gamesPlayed = status.gamesPlayed;

      return status.activeGameID ? getGame(status.activeGameID) : getNewGame();
    })
    .then(handleRes)
    .then(render);
};

init();
