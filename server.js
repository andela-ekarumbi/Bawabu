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

app.use( '/api/v1', require('./app/routes/api')( wagner ));

app.listen( process.env.PORT || config.port );
console.log( 'Listening on port ', config.port );