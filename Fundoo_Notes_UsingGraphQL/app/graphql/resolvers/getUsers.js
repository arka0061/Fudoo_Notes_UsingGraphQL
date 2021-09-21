const userModel = require('../../models/user.model.js');
module.exports = {
    users: () => {
        return userModel.find();
    }
}