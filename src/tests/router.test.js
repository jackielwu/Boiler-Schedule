const request = require('supertest');
const app = require('../index');

describe('Unit Test: Router - GET /', function(){
  it('Validate 200 OK response.', function(done){
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res){
        if (err)  return done(err);
        done();
      });
  });
});
