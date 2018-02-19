const auth = require('../auth');
const assert = require('chai').assert;

describe('Unit Test: Auth - Purdue CAS', function() {
  it('Validate Purdue CAS object definition.', function() {
    assert.isDefined(auth, 'Purdue CAS object is defined.');
  });
})
