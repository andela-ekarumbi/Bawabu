var mongoose = require('mongoose'),
    _ = require('underscore'),
    config = require('../../config');

module.exports = function( wagner ) {

  // connect to database
  mongoose.connect( process.env.DATABASE || config.database );

  var User = 
    mongoose.model( 'User', require('./user'), 'users' );
  var Staff =
    mongoose.model( 'Staff', require('./staff'), 'staff' );
  var Log = 
    mongoose.model( 'Log', require('./log'), 'logs' );
  var Guest =
    mongoose.model( 'Guest', require('./guest'), 'guests' );

  var models = {
    User: User,
    Staff: Staff,
    Log: Log
  };

  _.each( models, function( value, key ) {
    wagner.factory( key, function() {
      return value;
    });
  });

  return models;
}