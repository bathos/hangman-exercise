const fs         = require('fs');
const path       = require('path');
const WordStream = require('./word-stream');

const WORDS_PATH_FILE_SEGMENTS = [
  __dirname,
  '..',
  '..',
  'node_modules',
  'google-10000-english',
  'google-10000-english-usa-no-swears-medium.txt'
];

const getFileStream = () => {
  const wordsFilePath = path.resolve(...WORDS_PATH_FILE_SEGMENTS);
  return fs.createReadStream(wordsFilePath);
};

const getWordList = () => new Promise((resolve, reject) => {
  const wordStream = new WordStream();

  wordStream.on('words', resolve);
  wordStream.on('error', reject);

  getFileStream().pipe(wordStream);
});

module.exports = getWordList;
