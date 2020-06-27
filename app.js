const express = require('express');
const createError = require('http-errors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const Tree = require('./models/trees')

// Enable local env files
dotenv.config()
const app = express()

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Enable gzip compression
app.use(compression());

const mongoPass = process.env.MONGO_PASS
const mongoUser = process.env.MONGO_USER
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPass}@cade-cluster-dodck.azure.mongodb.net/cade`

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.on('error', function callback() {
  console.log('\nEnsure that you are running a database. \nYou may need to start one with "$ sudo mongod" \nPlease see our README.md for more info. ')
});

db.once('open', function callback() {
  console.log('Initialized Connection with MongoDB.\n');
});

app.get('/trees/', function(req, res, next) {
  const {id, space, scenario} = req.query
  let search = {}
  if (id) search.id = id
  if (space) search.space = space
  if (scenario) search.scenario = scenario
  return Tree
    .find(search)
    .exec(function (err, trees) {
      return res.send(trees)
    })
});







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;


app.listen(port, () => console.log(`Listening on port ${port}`));