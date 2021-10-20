/**************************************************************************************************************
 * @description   : It is used for making mail Schema in database and storing mail info
 * temporarily
 * @package       : mongoose
 * @file          : app/models/mail.model.js
 * @author        : Arka Parui
*****************************************************************************************************************/

const mongoose = require('mongoose');
const mailSchema = mongoose.Schema({
  mail:
    { type: String },
  tempcode:
    { type: String, },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: 60 },
  },
});

module.exports = mongoose.model('mailModel', mailSchema);