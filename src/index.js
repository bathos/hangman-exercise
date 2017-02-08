const app          = require('express')();
const sessionMW    = require('./middleware/session');
const staticMW     = require('./middleware/static');
const gameRoutes   = require('./routes/game-routes');
const statusRoutes = require('./routes/status-routes');

const PORT = 8888;

app.use(sessionMW());
app.use('/status', statusRoutes());
app.use('/games', gameRoutes());
app.use(staticMW());
app.listen(PORT);

process.stdout.write(`Listening on port ${ PORT }.\n`);
