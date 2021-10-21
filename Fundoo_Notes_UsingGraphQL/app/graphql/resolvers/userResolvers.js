/*********************************************************************
 * Execution    : 1. Default node with npm   cmd> node server.js
 *                2. If nodemon installed    cmd> npm start
 * 
 * Purpose      : Controls the operations of user creation and other CRUD
 * 
 * @package     : bcrypt,apollo-server-errors
 * @file        : app/graphql/resolvers/userResolvers.js
 * @overview    : controls user creation, update and retrieval tasks
 * @module      : this is necessary to create new user.
 * @author      : Arka Parui
 *********************************************************************/

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

    /**
      * @description Query to get all users from usermodel Schema in Database
      */
    users: async () => await userModel.find(),
  },

  Mutation: {

    /**
      * @description Mutation to get create user and store them in database
      * @param {*} empty
      * @param {*} input 
      */
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

    /**
     * @description Mutation to get login user and return login credentials with token
     * @param {*} empty
     * @param {*} input 
     */
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

    /**
     * @description Mutation to get send email to a registered email id for mailcode
     * to reset the password of the existing account
     * @param {*} empty
     * @param {*} input 
     */
    forgotpassword: async (_, { input }) => {
      try {
        const userPresent = await userModel.findOne({ email: input.email });
        if (!userPresent) {
          return new ApolloError.AuthenticationError('User is not Registered', { email: 'Not Registered' });
        }
        const check = await mailModel.find({ mail: input.email })
        if (check.length != 0) {
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

    /**
     * @description Mutation to set newpassword of the registered account by using mailcode
     * sent in the forgetpassword api
     * @param {*} empty
     * @param {*} input 
     * @param {*} context
     */
    resetpassword: async (_, { input }, context) => {
      try {
        if (!context.id) {
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const userPresent = await mailModel.find({ mail: context.email });
        if (userPresent.length === 0) {
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
