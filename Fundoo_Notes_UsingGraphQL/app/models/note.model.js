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