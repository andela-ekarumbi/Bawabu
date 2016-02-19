var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StaffSchema = new Schema({
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
  }
});

module.exports = StaffSchema;