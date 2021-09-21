const userModel = require('../../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var tokenSaved = null;

const JWT_SECRET = '@1287hbkjasbdque1db19b39u21adnkanjNjn@asdassd24v43b91b'

module.exports = {
    loginUser: async args => {
        try {
            const userPresent = await userModel.findOne({ email: args.loginInput.email });
            if (!userPresent) {
                throw new Error('User Not Present')
            }
            const check = await bcrypt.compare(args.loginInput.password, userPresent.password)
            if (!check) {
                throw new Error('Invalid password')
            }
            const token = jwt.sign({
                id: userPresent.id,
                firstName: userPresent.firstName
            }, JWT_SECRET)
            return {
                _id: userPresent.id,
                token: token,
                firstName: userPresent.firstName
            }
        }
        catch (error) {
            throw error;
        }
    }
}


