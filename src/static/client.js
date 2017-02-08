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

  return ({ guesses, won }) => {
    if (won) {
      return;
    }

    parts.slice(0, guesses.length).forEach(part => {
      part.style.opacity = 1;
    });

    parts.slice(guesses.length).forEach(part => {
      part.style.opacity = 0;
    });

    if (guesses.length === parts.length) {
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
    You have ten tries total to complete the word.
  `;

  parent.appendChild(instructions);

  return noop;
};

const getRenderStatus = parent => {
  const status    = document.createElement('div');
  const remaining = document.createTextNode('');
  const failMsg   = document.createElement('span');

  status.classList.add('status');

  failMsg.style.visibility = 'hidden';
  failMsg.textContent = ' Press ESC to try again.';

  status.appendChild(document.createTextNode('You have '));
  status.appendChild(remaining);
  status.appendChild(document.createTextNode('remaining guesses.'));
  status.appendChild(failMsg);

  parent.appendChild(status);

  return ({ remainingGuessCount }) => {
    remaining.textContent = remainingGuessCount;
    failMsg.style         = remainingGuessCount ? 'hidden' : 'visible';
  };
};

const init = () => {
  const fragment = document.createDocumentFragment();

  const renderFns = [
    getRenderHangman,
    getRenderStatus,
    getRenderInstructions
  ].map(getRender => getRender(fragment));

  const render = game =>
    renderFns.forEach(render => render(game));

  document.body.appendChild(fragment);

  window.render = render;
};

const noop = () => undefined;

init();
