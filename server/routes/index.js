const express = require('express');
const router = express.Router();
var Promise = require('bluebird');
var options = {
    promiseLib: Promise // overriding the default (ES6 Promise);
};
var pgp = require('pg-promise')(options);
const path = require('path');
const connectionString = process.env.DATABASE_URL || 
  'postgres://postgres:postgres10@localhost:5432/todo';

var db = pgp(connectionString);
var route = '/api/v1/todos'; 

var handleError1 = function(err) {
  console.log(err);
  return res.status(500).json({success: false, data: err});
};

//Generic final pathway for all routes
function respond(promise, res) {
  promise.then(function(data) {
    return db.query("SELECT * FROM items ORDER BY id ASC");
  })
  .then(function(data) {
    return res.json(data);
  })
  .catch(function(err) {
    console.log(err);
    return res.status(500).json({success: false, data: err});
  })
}

router.post(route, (req,res) => {
  //grab data from http request
  const data = {text: req.body.text, complete: false};
  //get a postgres client from the connection pool
  var promise = db.none('INSERT INTO items(text, complete) values($1, $2)', 
      [data.text, data.complete]);
  respond(promise, res);  
});

router.get(route, (req,res) => {
  respond(Promise.resolve(), res);
});

router.put(route + '/:todo_id', (req,res) => {
  //grab data from http request
  const data = {text: req.body.text, complete: req.body.complete, id: req.params.todo_id};
  var promise = db.none('UPDATE items SET text=($1), complete=($2) WHERE id=($3)', data);
  respond(promise, res);  
});

router.delete(route + '/:todo_id', (req,res) => {
  //grab data from URL parameters
  const id = req.params.todo_id;
  var promise = db.none('DELETE FROM items WHERE id=($1)', [id]);
  respond(promise, res);   
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile(path.join(
    __dirname, '..', '..', 'client', 'views', 'index.html'));
});

module.exports = router;
