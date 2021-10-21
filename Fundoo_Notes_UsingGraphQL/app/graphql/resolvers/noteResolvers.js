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
const trashModel = require('../../models/trash.model');

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
            const trashmodel = new trashModel(
              {
                noteID: input.noteId,
                email: checkNotes[index].emailId,
                title: checkNotes[index].title,
                description: checkNotes[index].description
              })
            await noteModel.findByIdAndDelete(checkNotes[index]);
            const checkLabel = await labelModel.findOne({ noteId: input.noteId });
            if (checkLabel) {
              trashmodel.label = checkLabel.labelName
              await trashmodel.save();
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
            await trashmodel.save();
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
    },
    /**
      * @description Mutation to display notes in trash
      * @param {*} empty
      * @param {*} empty 
      * @param {*} context
      */
    displayTrash: async (_, __, context) => {
      try {
        if (!context.id) {
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const trashNotes = await trashModel.find()
        if (trashNotes.length === 0) {
          return new ApolloError.UserInputError('No Notes Are Presnt in the trash');
        }
        return trashNotes
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },
    /**
      * @description Mutation to restore notes from trash
      * @param {*} empty
      * @param {*} input
      * @param {*} context
      */
    restoreNote: async (_, { input }, context) => {
      try {
        if (!context.id) {
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const checkNotes = await trashModel.find({ noteID: input.noteId });
        if (checkNotes.length === 0) {
          return new ApolloError.UserInputError('No Notes Are Presnt in the trash');
        }
        let index = 0;
        while (index < checkNotes.length) {
          if (JSON.stringify(checkNotes[index].noteID) === JSON.stringify(input.noteId)) {
            const notemodel = new noteModel({
              title: checkNotes[index].title,
              description: checkNotes[index].description,
              emailId: checkNotes[index].email,
            });
            await notemodel.save();
            if (!checkNotes[index].label) {
              await trashModel.findByIdAndDelete(checkNotes[index]._id);
              return `Note with id: ${checkNotes[index]._id} is restored Sucessfully`
            }
            const checkLabel = await labelModel.findOne({ labelName: checkNotes[index].label });
            if (checkLabel) {
              checkLabel.noteId.push(input.noteId)
              await checkLabel.save();
              await trashModel.findByIdAndDelete(checkNotes[index]._id);
              return `Note with id: ${checkNotes[index]._id} is restored Sucessfully`
            }
            const labelmodel = new labelModel({
              userId: context.id,
              noteId: input.noteId,
              labelName: checkNotes[index].label,
            });
            //labelmodel.noteId.push(input.noteID)
            await labelmodel.save();
            await trashModel.findByIdAndDelete(checkNotes[index]._id);
            return `Note with id: ${checkNotes[index]._id} is restored Sucessfully`
          }
          index++;
        }
        return new ApolloError.UserInputError(`Note with id ${input.noteId} was not found`);
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },
    /**
      * @description Mutation to delete notes permanently
      * @param {*} empty
      * @param {*} input 
      * @param {*} context
      */
    deleteNoteForever: async (_, { input }, context) => {
      try {
        const checkNotes = await trashModel.find({ noteID: input.noteId });
        if (checkNotes.length === 0) {
          return new ApolloError.UserInputError('No Notes Are Present in the trash');
        }
        let index=0;
        while (index < checkNotes.length) {
          if (JSON.stringify(checkNotes[index].noteID) === JSON.stringify(input.noteId)) {
            await trashModel.findByIdAndDelete(checkNotes[index]._id);
            return `Note with Noteid:${input.noteId} is deleted permanently`
          }
          index++;
        }
        return "Note with the given id is not found"

      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    }
  }
}
module.exports = noteResolvers;
