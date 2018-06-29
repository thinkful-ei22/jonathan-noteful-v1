'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function () {
  it('should return default length', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
      });
  });
  
  it('should return objects with correct keys', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });
});

it('should return the correct results', function () {
  return chai.request(app)
    .get('/api/notes?searchTerm=government')
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(1);
      expect(res.body[0]).to.be.a('object');
    });
});


it('should return empty array', function () {
  return chai.request(app)
    .get('/api/notes?searchTerm=Incorrect%20Search')
    .then(res => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(0);
    });
});

describe('GET /api/notes/:id', function() {
  it('should return correct object', function(){
    return chai.request(app)
      .get('/api/notes/1007')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1007);
        expect(res.body.title).to.equal('10 ways marketers are making you addicted to cats');
      });
  });
  it('should return 404', function(){
    return chai.request(app)
      .get('/api/notes/DOESNOTEXIST')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('POST api/notes', function(){
  it('should create and return a new item', function(){
    const newItem = {title: 'My Biography', content: 'I am Awesome'};
    return chai.request(app)
      .post('/api/notes')
      .send(newItem)
      .then(res => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');

        expect(res.body.id).to.equal(1010);
        expect(res.body.title).to.equal(newItem.title);
        expect(res.body.content).to.equal(newItem.content);
        expect(res).to.have.header('location');
      });
  });
  it('should return an object with a message property,', function(){
    const missingTitle = {test: 'is this working?'};
    return chai.request(app)
      .post('/api/notes')
      .send(missingTitle)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res).to.be.an('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('PUT /api/notes/:id', function() {
  it('Should update and return a note object', function(){
    const updateData = {
      title: 'My life',
      content: 'Is good'
    };
    return chai.request(app)
      .put('/api/notes/1001')
      .send(updateData)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1001);
        expect(res.body.title).to.equal(updateData.title);
        expect(res.body.content).to.equal(updateData.content);
      });
  });
  
  it('Should respond with 404', function(){
    const updateData = {
      title: 'my Life',
      content: 'is good'
    };
    return chai.request(app)
      .put('/api/notes/DOESNOTEXIST')
      .send(updateData)
      .catch(err => err.res)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('DELETE /api/notes/:id', function() {
  it('should delete an item by id', function(){
    return chai.request(app)
      .delete('/api/notes/1001')
      .then(res => {
        expect(res).to.have.status(204);
      });
  });
});