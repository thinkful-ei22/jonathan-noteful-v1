'use strict';



// Load array of notes
const express = require('express');

// const data = require('./db/notes');
// const simDB = require('./db/simDB');
// const notes = simDB.initialize(data);
const morgan = require('morgan');

const app = express();
const notesRouter = require('./router/notes.router');

const { PORT } = require('./config');

// const logger = require('./middleware/logger');


console.log('Hello Noteful!');

// Log all requests

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

app.use(express.static('public'));
app.use(express.json());
app.use('/api', notesRouter);

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

if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;
