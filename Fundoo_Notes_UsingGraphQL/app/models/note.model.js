/**************************************************************************************************************
 * @description   : It is used for making note Schema in database and storing note info
 * @package       : mongoose
 * @file          : app/models/note.model.js
 * @author        : Arka Parui
*****************************************************************************************************************/

const mongoose = require('mongoose');
const noteSchema = mongoose.Schema({
    emailId:{
        type:String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model('noteModel', noteSchema);