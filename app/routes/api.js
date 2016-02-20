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
          handleError( error, res );
        }else {
          return res.json({
            success: true,
            message: 'User successfully created'
          });
        }
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
            message: 'Authentication failed. User not found.'
          });
        } else if ( user ) {
          // user found
          // check if password matches
          var validPassword = user.comparePassword( req.body.password );

          if ( !validPassword ) {
            // auth failure
            return res.json({
              success: false,
              message: 'Authentication failed. Wrong password'
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

  api.route('/user/id/:user_id')
    .get( wagner.invoke(function( User ) {
      return function( req, res ) {
        User.findById( req.body.user_id, handleOne.bind( null, 'user', res));
      };
    }));

  api.route('/staff')
    // get all staff
    .get(wagner.invoke(function( Staff ) {
      return function( req, res ) {
        Staff.find( handleMany.bind( null, 'staff', res ) );
      };
    }))
    // create a new staff member
    .post(wagner.invoke(function( Staff, Log ) {
      return function( req, res ) {
        staff = new Staff();

        staff.name = req.body.name;

        staff.save(function( error, staff ) {
          return res.json({
            success: true,
            message: 'Staff created successfully.'
          });
        });
      };
    }));

  api.route('/checkin/name/:find_name')
    .post(wagner.invoke(function( Staff, Log ) {
      return function( req, res ) {
        if ( req.body.staff ) {
          // find staff
          Staff.findOne({ name: req.body.staff }).exec(function( error, staff ) {
            if( error ) {
              handleError( error );
            }

            if ( !staff ) {
              return res.json({
                success: true,
                message: 'No user exists with that name.'
              });
            }

            return res.json({
              success: true,
              staff: staff
            });
          });
        } else if ( req.body.guest_name ) {

        } else {
          return res.json({
            success: false,
            message: 'No fields defined.'
          });
        }
      };
    }));

  return api;

};

function handleOne( property, res, error, result) {
  if ( error ) {
    handleError( error );
  }

  if ( !result ) {
    return res.json({
      success: false,
      message: 'Not record exists.'
    });
  }
}

function handleMany( property, res, error, results ) {
  if ( error ) {
    handleError( error, res );
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

function handleError( error, res ) {
  return res
    .status( status.INTERNAL_SERVER_ERROR )
    .json({
      success: false,
      error: error.toString()
    });
}
