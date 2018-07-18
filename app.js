var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var annonceRouter = require('./routes/annonce');
var bodyParser = require('body-parser')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.connect('mongodb://rania:PNETJ9t13FZyO5B55yIQOikeV9cXgslKLlBC06YrZC0GSh61hhbx4RAf8OJg62iuMRiaVQ4DHYC0fltAvF2Z0Q%3D%3D@rania.documents.azure.com:10255/?ssl=true');
var db = mongoose.connections;

/*mongoose.connect('mongodb://localhost/fflokv14');
var db = mongoose.connections;*/


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use('/api', annonceRouter);

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

module.exports = app;
