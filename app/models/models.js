var mongoose = require('mongoose'),
    _ = require('underscore'),
    config = require('../../config');

module.exports = function( wagner ) {

  // connect to database
  mongoose.connect( process.env.DATABASE || config.database );

  var User = 
    mongoose.model( 'User', require('./user'), 'users' );

  var models = {
    User: User
  };

  _.each( models, function( value, key ) {
    wagner.factory( key, function() {
      return value;
    });
  });

  return models;
}