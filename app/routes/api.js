var express = require('express'),
    status = require('http-status');

module.exports = function( wagner ) {
  var api = express.Router();

  /* Sign Up User */
  api.post( '/user', wagner.invoke(function( User ) {
    return function( req, res ) {

      var user = new User();

      user.username = req.body.username;
      user.password = req.body.password;
      user.name = req.body.name;

      user.save(function( error ) {
        if ( error ) {
          handleError( error, res );
        }

        return res.json({
          success: true,
          message: 'User successfully created'
        });
      });
    };
  }));

  return api;

}

function handleError( error, res ) {
  if ( error ) {
    return res
      .status( status.INTERNAL_SERVER_ERROR )
      .json({
        success: false,
        error: error.toString()
      });
  }
}