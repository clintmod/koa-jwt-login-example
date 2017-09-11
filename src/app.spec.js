'use strict';

const app = require('./app');
const server = app.listen();
const request = require('supertest');
const assert = require('assert');

const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGhlZHVkZSIsIm5' +
    'hbWUiOiJNci4gTGVib3dza2kifSwiZXhwIjo0NjU4NTkxNzEzLCJpYXQiOjE1MDQ5OTE3MTN9.nZqc6O' +
    'SdccIx4NXovqqHW5iXAyIsPhEkT2SiwyW1LvU';

const EXPIRED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGhlZHVkZSIsIm5' +
    'hbWUiOiJNci4gTGVib3dza2kifSwiZXhwIjoxNTA0OTkxODIxLCJpYXQiOjE1MDQ5OTE4MjJ9.llUQYi' +
    'eU1sdd-0RAL6IbqJWT4OkuwPDugumFq_APJPY';

const INVALID_SIGNATURE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGhlZHVkZSIsIm5' +
    'hbWUiOiJNci4gTGVib3dza2kifSwiZXhwIjoxNTA0OTkxODIxLCJpYXQiOjE1MDQ5OTE4MjJ9.llUQYi' +
    'eU1sdd-0RAL6IbqJWT4OkuwPDugumFq_APJP1';

const INVALID_TOKEN = 'e1JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGhlZHVkZSIsIm5' +
    'hbWUiOiJNci4gTGVib3dza2kifSwiZXhwIjoxNTA0OTkxODIxLCJpYXQiOjE1MDQ5OTE4MjJ9.llUQYi' +
    'eU1sdd-0RAL6IbqJWT4OkuwPDugumFq_APJPY';

const JWT_MALFORMED_TOKEN = 'e1JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGhlZHVkZSIsIm5' +
    'hbWUiOiJNci4gTGVib3dza2kifSwiZXhwIjoxNTA0OTkxODIxLCJpYXQiOjE1MDQ5OTE4MjJ9';

describe('Login example', () => {
  it('should allow GET requests to the base "/" route', done => {
    request(server)
      .get('/')
      .expect(200)
      .end(done);
  });

  it('should allow POST requests to the "public/register" route', done => {
    request(server)
      .post('/public/register')
      .send({username: 'user1', password: 'password1', email: 'user1@gmail.com', name: 'Mr. Lebowski'})
      .set('Accept', 'application/json')
      .expect(200)
      .end(done);
  })

  it('should return 400 for bad POST requests to the "public/register" route', done => {
    request(server)
      .post('/public/register')
      .send({user: 'user1', password: 'password1', email: 'user1@gmail.com', name: 'Mr. Lebowski'})
      .set('Accept', 'application/json')
      .expect(400)
      .end(done);
  })

  it('should return 406 for trying to register an existing user with the "public/regis' +
      'ter" route',
  done => {
    request(server)
      .post('/public/register')
      .send({username: 'user1', password: 'password1', email: 'user1@gmail.com', name: 'Mr. Lebowski'})
      .set('Accept', 'application/json')
      .expect(406)
      .end(done);
  })

  it('should allow POST requests to the "public/login" route', done => {
    request(server)
      .post('/public/login')
      .send({username: 'user1', password: 'password1'})
      .set('Accept', 'application/json')
      .expect(200)
      .end(done);
  })

  it('should return 401 for bad POST requests to the "public/login" route', done => {
    request(server)
      .post('/public/login')
      .send({username: 'dude', password: 'password1'})
      .set('Accept', 'application/json')
      .expect(401)
      .end(done);
  })

  it('should prevent GET requests to the "api/v1" route without a token', done => {
    request(server)
      .get('/api/v1')
      .expect(401)
      .end(done);
  });

  it('should allow GET requests to the "api/v1" route with a valid token', done => {
    request(server)
      .get('/api/v1')
      .set('Authorization', 'Bearer ' + VALID_TOKEN)
      .expect(200)
      .end(done);
  })

  it('a POST request to a private route should return "token expired" if the token has' +
      ' expired',
  done => {
    request(server)
      .get('/api/v1')
      .set('Authorization', 'Bearer ' + EXPIRED_TOKEN)
      .expect(401)
      .end(function (err, result) {
        assert.equal(result.body.error, 'jwt expired');
        assert.equal(result.header['x-status-reason'], 'jwt expired');
        done();
      });
  })

  it('a POST request to a private route should return "invalid signature" if the token' +
      ' signature is invalid',
  done => {
    request(server)
      .get('/api/v1')
      .set('Authorization', 'Bearer ' + INVALID_SIGNATURE_TOKEN)
      .expect(401)
      .end(function (err, result) {
        assert.equal(result.body.error, 'invalid signature');
        assert.equal(result.header['x-status-reason'], 'invalid signature');
        done();
      });
  })

  it('a POST request to a private route should return "invalid token" if the token is ' +
      'invalid',
  done => {
    request(server)
      .get('/api/v1')
      .set('Authorization', 'Bearer ' + INVALID_TOKEN)
      .expect(401)
      .end(function (err, result) {
        assert.equal(result.body.error, 'invalid token');
        assert.equal(result.header['x-status-reason'], 'invalid token');
        done();
      });
  })

  it('a POST request to a private route should return "jwt malformed" if the token is ' +
      'malformed',
  done => {
    request(server)
      .get('/api/v1')
      .set('Authorization', 'Bearer ' + JWT_MALFORMED_TOKEN)
      .expect(401)
      .end(function (err, result) {
        assert.equal(result.body.error, 'jwt malformed');
        assert.equal(result.header['x-status-reason'], 'jwt malformed');
        done();
      });
  })

})
