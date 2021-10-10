const mongoose = require('mongoose');
const mailSchema = mongoose.Schema({
  mail:
    { type: String },
  code:
    { type: String, },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1m' },
  },
});

module.exports = mongoose.model('mailModel', mailSchema);