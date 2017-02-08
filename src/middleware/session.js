const expressSession = require('express-session');

module.exports = () => expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'corpse dabble talisman; narnia gavel'
});
