var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: {
      sparse: true
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    required: true
  },
  is_admin: {
    type: Boolean
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
});

// hash password before save
UserSchema.pre( 'save', function( next ) {
  var user = this;
  if ( !user.isModified('password') ) {
    return next();
  } else {
    bcrypt.hash( user.password, null, null, function( error, hash ) {
      user.password = hash;
      next();
    });
  }

});

// set timestamps
UserSchema.pre( 'save', function( next ) {
  this.updated_at = new Date();
  next();
});

// compare password with the one in database
UserSchema.methods.comparePassword = function( password ) {
  return bcrypt.compareSync( password, this.password );
}

module.exports = UserSchema;