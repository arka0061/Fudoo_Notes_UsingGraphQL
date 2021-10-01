const mongoose = require('mongoose');
const noteSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model('noteModel', noteSchema);