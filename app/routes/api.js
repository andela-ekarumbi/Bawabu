var express = require('express'),
    status = require('http-status'),
    jwt = require('jsonwebtoken'),
    secret = require('../../config').secret;

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
          handleError( error );
        }

        return res.json({
          success: true,
          message: 'User successfully created'
        });
      });
    };
  }));

      /* JWT Token Auth */
  api.post( '/authenticate', wagner.invoke(function( User ) {
    return function( req, res ) {
      // find the user
      User.findOne({
        username: req.body.username
      })
      .select('name username password')
      .exec(function( error, user ) {
        if ( error ) {
          throw error;
        }

        if ( !user ) {
          // no user found
          return res.json({
            success: false,
            message: 'Authentication failed. \
            User not found.'
          });
        } else if ( user ) {
          // user found
          // check if password matches
          var validPassword = user.comparePassword( req.body.password );

          if ( !validPassword ) {
            // auth failure
            return res.json({
              success: false,
              message: 'Authentication failed. \
              Wrong password'
            });
          } else {
            // auth success
            // create token
            var token = jwt.sign({
              name: user.name,
              username: user.username
            }, secret, {
              expiresIn: 86400 // 24 hrs
            });

            return res.json({
              success: true,
              message: 'Authenticated.',
              token: token
            });
          }
        }
      });
    };
  }));

  /* Middleware for token validation */
  api.use(function( req, res, next ) {
    // get token from req
    var token = req.body.token || 
      req.params.token || req.headers['x-access-token'];

    // decode the token
    if ( token ) {
      // verify secret and check exp
      jwt.verify( token, secret, function( error, decoded ) {
        if ( error ) {
          return res.status( status.FORBIDDEN ).json({
            success: false,
            message: 'Token validation failed.'
          });
        } else {
          // decoded token
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // no token
      // return access forbidden 403
      return res.status( status.FORBIDDEN ).json({
        success: false,
        message: 'No token provided.' 
      });
    }

  });


  api.get( '/user', wagner.invoke(function( User ) {
    return function( req, res ) {
      User.find( handleMany.bind( null, 'users', res ) );
    };
  }));

  return api;

}

function handleMany( property, res, error, results ) {
  if ( error ) {
    handleError( error );
  }

  if ( !results ) {
    return res.status( status.NOT_FOUND ).json({
      success: false,
      message: 'Not found.'
    });
  }

  var json = {};
  json.success = true;
  json[property] = results;
  res.json( json );
}

function handleError( error ) {
  return res
    .status( status.INTERNAL_SERVER_ERROR )
    .json({
      success: false,
      error: error.toString()
    });
}