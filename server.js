var express = require('express'),
    wagner = require('wagner-core'),
    config = require('./config'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');

// pass wagner to models
require('./app/models/models.js')( wagner );

var app = express();

app.use( morgan('dev') );

// parse application/json
app.use( bodyParser.json() );
// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded({ extended: true }) );

// configure app to handle CORS req
app.use(function( req, res, next ) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 
    'X-Requested-With, content-type, Authorisation');
  next();
});

app.use( '/api/v1', require('./app/routes/api')( wagner ));

app.use( express.static( __dirname + '/public' ) );

app.listen( process.env.PORT || config.port );
console.log( 'Listening on port ', config.port );