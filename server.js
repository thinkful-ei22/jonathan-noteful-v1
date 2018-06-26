'use strict';



// Load array of notes
const express = require('express');

const data = require('./db/notes');
const simdDB = require('./db/simDB');
const notes = simDB.initiailize(data);

const app = express();

const { PORT } = require('./config');

const logger = require('./middleware/logger');


console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

app.use(logger);


app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  let searchTerm = req.query.searchTerm;
  if (searchTerm) {
    let filtered = data.filter(item => {
      return item.title.includes(searchTerm);
    });
    res.json(filtered);
  }
  res.json(data);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  let note = data.find(item => item.id === Number(id));
  res.json(note);
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
