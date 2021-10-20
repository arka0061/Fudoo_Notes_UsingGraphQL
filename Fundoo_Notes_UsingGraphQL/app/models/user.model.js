/**************************************************************************************************************
 * @description   : It is used for making user Schema in database and storing user info
 * @package       : mongoose
 * @file          : app/models/user.model.js
 * @author        : Arka Parui
*****************************************************************************************************************/

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model('userModel', userSchema);