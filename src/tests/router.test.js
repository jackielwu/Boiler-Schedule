const request = require('supertest');
const app = require('../index');


describe('GET /', function(){
  it('Responds with homepage', function(done){
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res){
        if (err)  return done(err);
        done();
      });
  });
});
