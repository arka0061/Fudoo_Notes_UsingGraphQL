const userModel = require('../../models/user.model.js');
const bcryptPassword = require('../../utilities/bcrpytpassword.js');
const joiValidation = require('../../utilities/joiValidation.js');
const bcrypt = require('bcryptjs');
const jwt = require('../../utilities/jwtToken');
const sendinfobymail = require('../../utilities/sendinfobymail.js');
const userResolvers = {
    //users query
    users: () => {
        return userModel.find();
    },

    //create user mutation
    createUser: async args => {
        try {
            const usermodel = new userModel({
                firstName: args.userInput.firstName,
                lastName: args.userInput.lastName,
                email: args.userInput.email,
                password: args.userInput.password,
            })
            const registerValidation =  joiValidation.authRegister.validate(usermodel._doc)
            if (registerValidation.error) {
                return ({
                    success: false,
                    message: registerValidation.error.message,
                });
            }
            const existingUser = await userModel.findOne({ email: args.userInput.email });
            if (existingUser) {
                return ({
                    success: false,
                    message: 'User already exists',
                });
            }
            bcryptPassword.hashpassword(args.userInput.password, (error, data) => {
                if (data) {
                    usermodel.password = data;
                }
                else{
                    throw error;
                }
                usermodel.save();
                return;
            })
            return ({
                success: true,
                message: 'New User Created',
            });
        }
        catch (error) {
            console.log(error)
            return ({
                success: false,
                message: 'Internal Error Occured',
            });  
        }
    },
    //login user mutation
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
        var token=jwt.getToken(userPresent);
           if(!token)
           {
               throw error;

           } return {
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
    },

    //forgot password mutation
    forgotpassword: async args => {
        try {
            const userPresent = await userModel.findOne({ email: args.forgetInput.email });
            if (!userPresent) {
                return ({
                    success: false,
                    message: 'User is not registered',
                });
            }
            sendinfobymail.getMailDetails(userPresent.email, (error, data) => {
                if (!data) {
                    return ({
                        success: false,
                        message: 'Failed to send Email',
                    });
                }
            })
            return ({
                success: true,
                message: 'Email Sent',
            });
        }
        catch (error) {
            console.log(error)
            return ({
                success: false,
                message: 'Internal Error Occured',
            });
        }

    },
    //reset password mutation
    resetpassword: async args => {
        try {
            const userPresent = await userModel.findOne({ email: args.resetInput.email });
            if (!userPresent) {
                return ({
                    success: false,
                    message: 'User is not registered',
                });
            }
            const checkCode = sendinfobymail.sendCode(args.resetInput.mailcode)
            if (checkCode == "false") {
                return ({
                    success: false,
                    message: 'Invalid Mail Code',
                });

            }
            bcryptPassword.hashpassword(args.resetInput.newpassword, (error, data) => {
                if (data) {
                    userPresent.password = data;
                    userPresent.save();
                }
                else {
                    throw error;
                }
            })
            return ({
                success: true,
                message: 'password changed',
            });

        }
        catch (error) {
            console.log(error)
            return ({
                success: false,
                message: 'Internal Error Occured',
            });
        }
    }
}
module.exports = userResolvers;

