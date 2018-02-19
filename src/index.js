const app = require('express')();
const session = require('express-session');
const router = require('./router');

const PORT = 3000

// Express session.
app.use(session({
  secret: 'SECRET_KEY', // TODO: Move to .env file for production.
  resave: false,
  saveUninitialized: true
}));

// Run Express.
app.use('/', router);
app.listen(PORT, () => console.log('Running application locally on port ' + PORT));

module.exports = app;
