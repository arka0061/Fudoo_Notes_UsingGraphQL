/*********************************************************************
 * Execution    : 1. Default node with npm   cmd> node server.js
 *                2. If nodemon installed    cmd> npm start
 * 
 * Purpose      : Controls the operations of note creation and other CRUD
 * 
 * @package     : apollo-server-errors
 * @file        : app/graphql/resolvers/noteResolvers.js
 * @overview    : controls note creation,deletetion update and retrieval tasks
 * @module      : this is necessary to create new notes
 * @author      : Arka Parui
 *********************************************************************/

const ApolloError = require('apollo-server-errors');
const userModel = require('../../models/user.model');
const noteModel = require('../../models/note.model');
const labelModel = require('../../models/label.model');

const noteResolvers = {
  Query: {

    /**
     * @description Query to get all notes from noteModel Schema in Database
     */
    notes: async () => await noteModel.find()
  },
  Mutation: {

    /**
      * @description Mutation to get notes of a registered user
      * @param {*} empty
      * @param {*} empty 
      * @param {*} context
      */
    getNotes: async (_, { }, context) => {
      try {
        if (!context.id) {
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const checkNotes = await noteModel.find({ emailId: context.email });
        if (checkNotes.length === 0) {
          return new ApolloError.UserInputError('User has not created any notes till now');
        }
        return checkNotes
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },

    /**
      * @description Mutation to create a note and store it in noteModel Schema of
      * Database
      * @param {*} empty
      * @param {*} input 
      * @param {*} context
      */
    createNote: async (_, { input }, context) => {
      try {
        if (!context.id) {
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const existingUser = await userModel.findOne({ email: context.email });
        const notemodel = new noteModel({
          title: input.title,
          description: input.description,
          emailId: existingUser.email,
        });
        await notemodel.save();
        return notemodel;
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },

    /**
      * @description Mutation to edit a existing note
      * @param {*} empty
      * @param {*} input 
      * @param {*} context
      */
    editNote: async (_, { input }, context) => {
      try {
        if (!context.id) {
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const checkNotes = await noteModel.find({ emailId: context.email });
        if (checkNotes.length === 0) {
          return new ApolloError.UserInputError('User has not created any notes till now');
        }
        let index = 0;
        while (index < checkNotes.length) {
          if (checkNotes[index].id === input.noteId) {
            await noteModel.findByIdAndUpdate(checkNotes[index], {
              title: input.title || checkNotes[index].title,
              description: input.description || checkNotes[index].description
            }, { new: true });
            return ({
              title: input.title || checkNotes[index].title,
              description: input.description || checkNotes[index].description
            })
          }
          index++;
        }
        return new ApolloError.UserInputError('Note with the given id was not found');
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },

    /**
      * @description Mutation to delete a note 
      * @param {*} empty
      * @param {*} input 
      * @param {*} context
      */
    deleteNote: async (_, { input }, context) => {
      try {
        if (!context.id) {
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const checkNotes = await noteModel.find({ emailId: context.email });
        if (checkNotes.length === 0) {
          return new ApolloError.UserInputError('User has not created any notes till now');
        }
        let index = 0;
        while (index < checkNotes.length) {
          if (checkNotes[index].id === input.noteId) {
            await noteModel.findByIdAndDelete(checkNotes[index]);
            const checkLabel = await labelModel.findOne({ noteId: input.noteId });
            if (checkLabel) {
              if (checkLabel.noteId.length === 1) {
                await labelModel.findByIdAndDelete(checkLabel.id);
              }
              await labelModel.findOneAndUpdate(
                {
                  labelName: checkLabel.labelName
                },
                {
                  $pull: {
                    noteId: input.noteId
                  },
                }
              )
            }
            return ({
              title: checkNotes[index].title,
              description: checkNotes[index].description
            })
          }
          index++;
        }
        return new ApolloError.UserInputError('Note with the given id was not found');
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    }
  }
}
module.exports = noteResolvers;
