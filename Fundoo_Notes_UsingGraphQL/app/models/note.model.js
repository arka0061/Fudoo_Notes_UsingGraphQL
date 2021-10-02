const mongoose = require('mongoose');
const { ObjectID } = require('typeorm');
const noteSchema = mongoose.Schema({
    userId:{
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