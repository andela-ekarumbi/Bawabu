var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LogSchema = new Schema({
  time_in: {
    type: Date
  },
  time_out: {
    type: Date
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  }
});

module.exports = LogSchema;