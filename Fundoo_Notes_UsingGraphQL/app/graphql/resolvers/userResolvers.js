const bcrypt = require('bcryptjs');
const ApolloError = require('apollo-server-errors');
const userModel = require('../../models/user.model');
const bcryptPassword = require('../../utilities/bcrpytpassword');
const joiValidation = require('../../utilities/joiValidation');
const jwt = require('../../utilities/jwtToken');
const sendinfobymail = require('../../utilities/sendinfobymail');
const noteModel=require('../../models/note.model');

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
          tempCode:"temp code wl be here"   
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
        const notesPresent = await noteModel.find({ userId: userPresent._id });
        if(!notesPresent)
        {
          notesPresent="No Notes Are Created By The User Yet"
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
          getNotes:notesPresent
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
    resetpassword: async (_, { input }) => {
      try {
        const userPresent = await userModel.findOne({ email: input.email });
        if (!userPresent) {
          return new ApolloError.AuthenticationError('User is not Registered', { email: 'Not Registered' });
        }
        const checkCode = sendinfobymail.sendCode(input.mailcode,userPresent);
        if (checkCode === 'false') {
          console.log(checkCode);
          return new ApolloError.AuthenticationError('Invalid mailcode', { mailcode: 'Does Not Match' });
        }
        if(checkCode==='expired')
        {
          return new ApolloError.AuthenticationError('Code Expired', { mailcode: 'Expired' });
        }
        bcryptPassword.hashpassword(input.newpassword, (error, data) => {
          if (data) {
            userPresent.password = data;
            userPresent.save();
          } else {
            return new ApolloError.ApolloError('Internal Server Error');
          }
        });
        return ({
          email: userPresent.email,
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
