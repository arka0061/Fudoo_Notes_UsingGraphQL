const userModel = require('../../models/user.model.js');
const bcryptPassword = require('../../utilities/bcrpytpassword.js');
const joiValidation = require('../../utilities/joiValidation.js');
const bcrypt = require('bcryptjs');
const jwt = require('../../utilities/jwtToken');
const sendinfobymail = require('../../utilities/sendinfobymail.js');
const { ApolloError } = require("apollo-server");
const userResolvers = {
    Query:{
    users: async() => {
        return await userModel.find();
    }
},
Mutation:{

 //create user mutation
    createUser: async (_, {input}) => {
        try {
            const usermodel = new userModel({
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                password: input.password,
            })
            const registerValidation = joiValidation.authRegister.validate(usermodel._doc)
            if (registerValidation.error) {
                return new ApolloError(registerValidation.error,401,{sucess: false});
            }
            const existingUser = await userModel.findOne({ email: input.email });
            if (existingUser) {
                return new ApolloError('User Already Exists',409,{sucess: false});
            }
            bcryptPassword.hashpassword(input.password, (error, data) => {
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
            return new ApolloError('Internal Error',500,{sucess: false});
        }
    },
    //login user mutation
    loginUser: async (_,{input}) => {
        try {
            const loginmodel = {
                email: input.email,
                password: input.password,
            }
            const loginValidation = joiValidation.authLogin.validate(loginmodel)
            if (loginValidation.error) {
                return new ApolloError(loginValidation.error,401,{sucess: false});
            }
            const userPresent = await userModel.findOne({ email: input.email });
            if (!userPresent) {
                return new ApolloError('Invalid Email id',403,{sucess: false});

            }
            const check = await bcrypt.compare(input.password, userPresent.password)
            if (!check) {
                return new ApolloError('Invalid Password',403,{sucess: false});
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
            return new ApolloError('Internal Error',500,{sucess: false});
        }
    },

    //forgot password mutation
    forgotpassword:  async (_,{input}) => {
        try {
            const userPresent = await userModel.findOne({ email: input.email });
            if (!userPresent) {
                return new ApolloError('User is not Registered',403,{sucess: false});
            }
            sendinfobymail.getMailDetails(userPresent.email, (error, data) => {
                if (!data) {
                    return new ApolloError('Failed to Send Email',424,{sucess: false});
                }
            })
            return ({
                email: userPresent.email
            });
        }
        catch (error) {
            return new ApolloError('Internal Error',500,{sucess: false});
        }
    },

    //reset password mutation
    resetpassword: async (_,{input})=> {
        try {
            const userPresent = await userModel.findOne({ email: input.email });
            if (!userPresent) {
                return new ApolloError('User is not Registered',403,{sucess: false});
            }
            const checkCode = sendinfobymail.sendCode(input.mailcode)
            if (checkCode == "false") {
                return new ApolloError('Invalid mailcode',403,{sucess: false});
            }
            bcryptPassword.hashpassword(input.newpassword, (error, data) => {
                if (data) {
                    userPresent.password = data;
                    userPresent.save();
                }
                else {
                    return new ApolloError('Internal Error',500,{sucess: false});
                }
            })
            return ({
                email: userPresent.email,
                newpassword: input.newpassword
            });

        }
        catch (error) {
            console.log(error)
            return new ApolloError('Internal Error',500,{sucess: false});
        }
    }
}}
module.exports = userResolvers;

