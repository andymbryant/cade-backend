const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

// Enable local env files
dotenv.config()

const apiRouter = require('./routes/api.js');

const app = express()

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Enable gzip compression
app.use(compression());

app.use('/api', apiRouter)

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

const mongoPass = process.env.MONGO_PASS
const mongoUser = process.env.MONGO_USER
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPass}@cade-cluster-dodck.azure.mongodb.net/test`

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  keepAlive: true,
  reconnectTries: 1000
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.on('error', function callback() {
  console.log('\nEnsure that you are running a database. \nYou may need to start one with "$ sudo mongod" \nPlease see our README.md for more info. ')
});

db.once('open', function callback() {
  console.log('Initialized Connection with MongoDB.\n');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));