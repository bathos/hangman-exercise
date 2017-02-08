const bodyParser = require('body-parser');
const express    = require('express');
const initGame   = require('../models/game-model');

module.exports = () => {
  const router = new express.Router();
  const Game = initGame();

  // POST /games (create new game)

  router.post('', (req, res) => {
    Game.create().then(game => {
      req.session.gameID = game.id;
      req.session.gamesPlayed = (req.session.gamesPlayed || 0) + 1;
      req.session.gamesWon    = (req.session.gamesWon || 0);
      res.json(game.toPublicView());
    }).catch(err => res.status(err.status || 500).json({ error: err.message }));
  });

  // GET /games/:id (retrieve game)

  router.get('/:id', (req, res) => {
    if (req.session.gameID !== req.params.id) {
      return req.status(403).json({
        error: 'Only user’s currently active game may be retrieved.'
      });
    }

    Game
      .findById(req.params.id)
      .then(game => res.json(game.toPublicView()))
      .catch(err => res.status(err.status || 500).json({ error: err.message }));
  });

  // PATCH /games/:id (updates game guesses)

  router.patch('/:id', bodyParser.json(), (req, res) => {
    if (req.session.gameID !== req.params.id) {
      return res.status(400).send({
        error: `Only user’s currently active game may be updated.`
      });
    }

    if (!req.body || req.body.id !== req.params.id) {
      return res.status(400).send({
        error: `PATCH game must have body and ID must match route.`
      });
    }

    Game
      .findById(req.params.id)
      .then(game => game.won)
      .then(alreadyWon =>
        Game
          .update(req.body)
          .then(game => {
            if (game.won && !alreadyWon) {
              req.session.gamesWon++;
            }

            res.json(game.toPublicView());
          })
          .catch(err =>
            res.status(err.status || 500).json({ error: err.message })
          )
      );

  });

  return router;
};
