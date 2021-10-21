const mongoose = require('mongoose');
const trashSchema = mongoose.Schema({
    noteID: {
        type: mongoose.Schema.Types.ObjectId
    },
    email: {
        type: String
    },
    label:{
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
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expireAfterSeconds: 604800 },
    },
});

module.exports = mongoose.model('trashModel', trashSchema);