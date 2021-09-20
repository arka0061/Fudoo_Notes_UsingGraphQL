const userModel = require('../../models/user.model.js');
module.exports = {
    loginUser: async args => {
        const existingUser = await userModel.findOne({ email: args.loginInput.email });
        if (existingUser) {
            return existingUser;
        }
    }
}