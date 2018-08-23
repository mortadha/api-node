var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerJSDoc = require('swagger-jsdoc');
var config = require('./config/config.js');
var apiRouter = require('./routesAdmin').router;


//instance express
var app = express();


// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Doc API fflok',
    version: '1.0.0',
    description: 'All API for fflok',
  },
  host: '',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./controllers/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);


// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


var bodyParser = require('body-parser');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  if(req.headers['x-api-key'] != config.x_api_key){
    return res.status(401).json({ 'error': 'x_api_key incorrect' });
  }
});
app.use(function myauth(req, res, next) {
  if(req.headers['x-api-key'] != config.x_api_key){
   // return res.status(401).json({ 'error': 'x_api_key incorrect' });
  }
  next();
});

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ 'error': 'Page 404' });;
});




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = "";
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(500).json({ 'error': 'err 500' });
  
});


app.listen(8080,()=>{
    console.log(`server running on port 8080`);
})
module.exports = app;
