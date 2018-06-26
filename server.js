'use strict';



// Load array of notes
const express = require('express');

const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

const app = express();

const { PORT } = require('./config');

const logger = require('./middleware/logger');


console.log('Hello Noteful!');

// Log all requests

app.use(logger);

app.use(express.static('public'));
app.use(express.json());

// INSERT EXPRESS APP CODE HERE...

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id, (err, list) => {
    if (err) {
      return next(err);
    }
    if (list) {
      res.json(list);
    }
    else {
      next();
    }
  });
  
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
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
