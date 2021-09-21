const userModel = require('../../models/user.model.js');
const joiValidation = require('../../utilities/joiValidation.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
module.exports = {
    loginUser: async args => {
        try {
            const loginmodel = {
                email: args.loginInput.email,
                password: args.loginInput.password,
            }
            const loginValidation = joiValidation.authLogin.validate(loginmodel)
            if (loginValidation.error) {
                return ({
                    success: false,
                    message: loginValidation.error.message,
                });
            }
            const userPresent = await userModel.findOne({ email: args.loginInput.email });
            if (!userPresent) {
                return {
                    success: false,
                    message: 'Invalid email'
                }
            }
            const check = await bcrypt.compare(args.loginInput.password, userPresent.password)
            if (!check) {
                return {
                    success: false,
                    message: 'Invalid Password'
                }
            }
            const token = jwt.sign({
                id: userPresent.id,
                firstName: userPresent.firstName
            }, process.env.JWT_SECRET)
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


