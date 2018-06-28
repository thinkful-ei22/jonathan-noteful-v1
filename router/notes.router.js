'use strict';
const simDB = require('../db/simDB');
const data = require('../db/notes');
const notes = simDB.initialize(data);
const express = require('express');
const router = express.Router();


router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm)
    .then(item => {
      if(item) {
        res.json(item);
      } 
    })
    .catch(err => {
      next(err);
    });
  // if (err) {
  //   return next(err); // goes to error handler
  // }
  // res.json(list); // responds with filtered array
});


router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  // if (err) {
  //   return next(err);
  // }
  // if (item) {
  //   res.json(item);
  // }
  // else {
  //   next();
  // }
});
  


// router.get('./boo', (req, res, next) => {
//   throw new Error('Boom!!');
// });

router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  // if (err) {
  //   return next(err);
  // }
  // if (item) {
  //   res.json(item);
  // } else {
  //   next();
  // }
});

// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(item => {
      if(item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  // if (err) {
  //   return next(err);
  // }
  // if (item) {
  //   res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
  // } else {
  //   next();
  // }

});

router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id)
    .then(item => {
      if(item) {
        res.sendStatus(204);
      }
    })
    .catch(err => {
      next(err);
    });
  //   if (err) {

  //     return next(err);
  //   }
  //   res.sendStatus(204);
  // });
});
 
module.exports = router;