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
                return {
                    success: false,
                    message: 'Invalid username'
                }
            }
            const check = await bcrypt.compare(args.loginInput.password, userPresent.password)
            console.log(check)
            if (!check) {
                return {               
                    success: false,
                    message: 'Invalid Password'
                }
            }
            const token = jwt.sign({
                id: userPresent.id,
                firstName: userPresent.firstName
            }, JWT_SECRET)
            return {
                _id: userPresent.id,
                token: token,
                firstName: userPresent.firstName,
                success: true,
                message: 'Login Sucessful'
            }
        }
        catch (error) {
            throw new Error('Internal Error Occured')

        }
    }
}


