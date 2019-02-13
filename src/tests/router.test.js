const request = require('supertest');
const assert = require('chai').assert;
const app = require('../old/index');

describe('Unit Test: Router - GET /', function() {
  it('Validate 200 OK response.', function(done) {
    request(app)
      .get('/')
      .end(function(err, res) {
        if (err)  return done(err);
        assert.strictEqual(res.statusCode, 200, 'Response code for / is ' + res.statusCode + '; it should be 200');
        done();
      });
  });
});
