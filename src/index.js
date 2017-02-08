const app           = require('express')();
const getRandomWord = require('./words/random-words')();
const staticMW      = require('./middleware/static');

const PORT = 8888;

app.use(staticMW());
app.listen(PORT);

process.stdout.write(`Listening on port ${ PORT }.\n`);
