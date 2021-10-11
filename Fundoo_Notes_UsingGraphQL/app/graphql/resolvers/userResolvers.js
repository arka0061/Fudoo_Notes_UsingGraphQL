const bcrypt = require('bcryptjs');
const ApolloError = require('apollo-server-errors');
const userModel = require('../../models/user.model');
const bcryptPassword = require('../../utilities/bcrpytpassword');
const joiValidation = require('../../utilities/joiValidation');
const jwt = require('../../utilities/jwtToken');
const sendinfobymail = require('../../utilities/sendinfobymail');
const noteModel = require('../../models/note.model');
const mailModel = require('../../models/mail.model');

const userResolvers = {

  Query: {
    users: async () => await userModel.find(),
  },

  Mutation: {
    // create user mutation
    createUser: async (_, { input }) => {
      try {
        const usermodel = new userModel({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: input.password,
        });
        const registerValidation = joiValidation.authRegister.validate(usermodel._doc);
        if (registerValidation.error) {
          return new ApolloError.ValidationError(registerValidation.error);
        }
        const existingUser = await userModel.findOne({ email: input.email });
        if (existingUser) {
          return new ApolloError.UserInputError('User Already Exists');
        }
        bcryptPassword.hashpassword(input.password, (error, data) => {
          if (data) {
            usermodel.password = data;
          } else {
            throw error;
          }
          usermodel.save();
        });
        return usermodel;
      } catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },
    // login user mutation
    loginUser: async (_, { input }) => {
      try {
        const loginmodel = {
          email: input.email,
          password: input.password,
        };
        const loginValidation = joiValidation.authLogin.validate(loginmodel);
        if (loginValidation.error) {
          return new ApolloError.ValidationError(loginValidation.error);
        }
        const userPresent = await userModel.findOne({ email: input.email });
        if (!userPresent) {
          return new ApolloError.AuthenticationError('Invalid Email id', { email: 'Not Found' });
        }
        let notesPresent = await noteModel.find({ emailId: userPresent.email });
        if (notesPresent.length === 0) {
          notesPresent = [{ title: "No Notes Are Created By The User Yet", description: "null" }]
        }
        const check = await bcrypt.compare(input.password, userPresent.password);
        if (!check) {
          return new ApolloError.AuthenticationError('Invalid password', { password: 'Does Not Match' });
        }
        const token = jwt.getToken(userPresent);
        if (!token) {
          throw new ApolloError.ApolloError('Internal Server Error');
        } return {
          _id: userPresent.id,
          token,
          firstName: userPresent.firstName,
          lastName: userPresent.lastName,
          email: userPresent.email,
          getNotes: notesPresent
        };
      } catch (error) {
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },

    // forgot password mutation
    forgotpassword: async (_, { input }) => {
      try {
        const userPresent = await userModel.findOne({ email: input.email });
        if (!userPresent) {
          return new ApolloError.AuthenticationError('User is not Registered', { email: 'Not Registered' });
        }
        const check=await mailModel.find({mail:input.email})
       if(check.length!=0)
       {
        return new ApolloError.UserInputError('Mail code already sent');
       }
        sendinfobymail.getMailDetails(userPresent.email, (error, data) => {
          if (!data) {
            return new ApolloError.ApolloError('Failed to send Email');
          }
        });
        return ({
          email: userPresent.email,
        });
      } catch (error) {
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },

    // reset password mutation
    resetpassword: async (_, { input }, context) => {
      try {
        if (!context.id) {
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const userPresent = await mailModel.find({ mail: context.email });
        if(userPresent.length===0)
        {
         return new ApolloError.UserInputError('Mailcode expired');
        }
        const checkCode = sendinfobymail.sendCode(input.mailcode, userPresent);
        if (checkCode === 'false') {
          return new ApolloError.AuthenticationError('Invalid mailcode', { mailcode: 'Does Not Match' });
        }
        if (checkCode === 'expired') {
          return new ApolloError.AuthenticationError('Code Expired', { mailcode: 'Expired' });
        }
        const saveToUser = await userModel.findOne({ mail: context.email })
        bcryptPassword.hashpassword(input.newpassword, (error, data) => {
          if (data) {
            saveToUser.password = data;
            saveToUser.save();
          } else {
            return new ApolloError.ApolloError('Internal Server Error');
          }
        });
        return ({
          email: context.email,
          newpassword: input.newpassword,
        });
      } catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },
  },
};
module.exports = userResolvers;
