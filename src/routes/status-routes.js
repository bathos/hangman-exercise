const express    = require('express');

module.exports = () => {
  const router = new express.Router();

  router.get('', (req, res) => {
    res.json({
      activeGameID: req.session.gameID,
      gamesPlayed:  req.session.gamesPlayed || 0,
      gamesWon:     req.session.gamesWon || 0
    });
  });

  return router;
};
