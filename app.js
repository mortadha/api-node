var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.connect('mongodb://rania:PNETJ9t13FZyO5B55yIQOikeV9cXgslKLlBC06YrZC0GSh61hhbx4RAf8OJg62iuMRiaVQ4DHYC0fltAvF2Z0Q%3D%3D@rania.documents.azure.com:10255/?ssl=true');
var db = mongoose.connections;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
var io = require('socket.io').listen(app.listen(3333));
io.sockets.on('connection', function (socket) {
  console.log('client connect');
  socket.on('echo', function (data) {
  io.sockets.emit('message', data);
});
});
app.post('/message', function(req, res, next) {
  var message = req.body.message;
  io.sockets.emit('message', message);
  return res.status(200).json({'message': true});
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
console.log('rania 2');
module.exports = app;
