const CASAuthentication = require('cas-authentication');

// MyPurdue Authentication.
var purdueCAS = new CASAuthentication({
  cas_url: 'https://www.purdue.edu/apps/account/cas/login',
  service_url: '', // TODO: Register application with ITAP.
  bounce_redirect: '/',
  logout: 'https://www.purdue.edu/apps/account/cas/logout'
});

// Google Authentication.

module.exports = {
  purdue: purdueCAS
}
