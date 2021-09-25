const userModel = require('../../models/user.model.js');
const bcryptPassword = require('../../utilities/bcrpytpassword.js');
const joiValidation = require('../../utilities/joiValidation.js');
const bcrypt = require('bcryptjs');
const jwt = require('../../utilities/jwtToken');
const sendinfobymail = require('../../utilities/sendinfobymail.js');
const { GraphQLError } = require('graphql');
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
            const registerValidation = joiValidation.authRegister.validate(usermodel._doc)
            if (registerValidation.error) {
                return new GraphQLError(registerValidation.error.message)
            }
            const existingUser = await userModel.findOne({ email: args.userInput.email });
            if (existingUser) {
                return new GraphQLError('User Already Exists');
            }
            bcryptPassword.hashpassword(args.userInput.password, (error, data) => {
                if (data) {
                    usermodel.password = data;
                }
                else {
                    throw error;
                }
                usermodel.save();
                return;
            })
            return usermodel;
        }
        catch (error) {
            console.log(error)
            return new GraphQLError('Internal Error Occured');
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
                return new GraphQLError(loginValidation.error.message);
            }
            const userPresent = await userModel.findOne({ email: args.loginInput.email });
            if (!userPresent) {
                return new GraphQLError('Invalid Email id');

            }
            const check = await bcrypt.compare(args.loginInput.password, userPresent.password)
            if (!check) {
                return new GraphQLError('Invalid Password');
            }
            var token = jwt.getToken(userPresent);
            if (!token) {
                throw error;

            } return {
                _id: userPresent.id,
                token: token,
                firstName: userPresent.firstName,
                lastName: userPresent.lastName,
                email: userPresent.email
            }
        }
        catch (error) {
            return new GraphQLError('Internal Error Occured');
        }
    },

    //forgot password mutation
    forgotpassword: async args => {
        try {
            const userPresent = await userModel.findOne({ email: args.forgetInput.email });
            if (!userPresent) {
                return new GraphQLError('User is not Registered');
            }
            sendinfobymail.getMailDetails(userPresent.email, (error, data) => {
                if (!data) {
                    return new GraphQLError('Failed to Send Email');
                }
            })
            return ({
                email: userPresent.email
            });
        }
        catch (error) {
            console.log(error)
            return new GraphQLError('Internal Error Occured');
        }
    },

    //reset password mutation
    resetpassword: async args => {
        try {
            const userPresent = await userModel.findOne({ email: args.resetInput.email });
            if (!userPresent) {
                return new GraphQLError('User is not Registered');
            }
            const checkCode = sendinfobymail.sendCode(args.resetInput.mailcode)
            if (checkCode == "false") {
                return new GraphQLError('Invalid mailcode');
            }
            bcryptPassword.hashpassword(args.resetInput.newpassword, (error, data) => {
                if (data) {
                    userPresent.password = data;
                    userPresent.save();
                }
                else {
                    return new GraphQLError('Internal Error Occured');
                }
            })
            return ({
                email: userPresent.email,
                newpassword: args.resetInput.newpassword
            });

        }
        catch (error) {
            console.log(error)
            return new GraphQLError('Internal Error Occured');
        }
    }
}
module.exports = userResolvers;

