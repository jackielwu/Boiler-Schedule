const auth = require('../old/auth');
const assert = require('chai').assert;

describe('Unit Test: Auth - Purdue CAS', function() {
  it('Validate Purdue CAS object definition.', function() {
    assert.isDefined(auth, 'Purdue CAS object is undefined.');
  });
})

describe('Regression Test: Auth - Purdue CAS URL', function() {
  const PURDUE_CAS_URL = 'https://www.purdue.edu/apps/account/cas/login';
  it('Validate Purdue CAS  URL.', function() {
    assert.strictEqual(auth.purdue.cas_url, PURDUE_CAS_URL, 'Purdue CAS URL is incorrect.');
  });
});
