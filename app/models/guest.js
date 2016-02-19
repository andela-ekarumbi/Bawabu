var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GuestSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  checked_in: {
    type: Boolean,
    default: false
  },
  last_visit_date: {
    type: Date,
    default: Date.now
  },
  id_number: {
    type: Number
  },
  phone_number: {
    type: Number
  },
  reason_for_visit: {
    type: String,
    required: true
  }
});

module.exports = GuestSchema;