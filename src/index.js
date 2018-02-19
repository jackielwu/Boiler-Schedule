const app = require('express')();
const session = require('express-session');
const CASAuthentication = require('cas-authentication');

const PORT = 3000

// Express session.
app.use(session({
  secret: 'SECRET_KEY', // TODO: Move to .env file for production.
  resave: false
}));

// MyPurdue Authentication.
var purdueCAS = new CASAuthentication({
  cas_url: 'https://www.purdue.edu/apps/account/cas/login',
  service_url: '', // TODO: Register application with ITAP.
  bounce_redirect: '/',
  logout: 'https://www.purdue.edu/apps/account/cas/logout'
});

// Google Authentication.


// Run Express.
app.listen(PORT, () => console.log('Running application locally on port ' + PORT));
