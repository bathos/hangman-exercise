const express = require('express');
const path    = require('path');

module.exports = () =>
  express.static(path.resolve(__dirname, '..', 'static'), {
    fallthrough: false
  });
