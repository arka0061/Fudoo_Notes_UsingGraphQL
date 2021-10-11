const ApolloError = require('apollo-server-errors');
const userModel = require('../../models/user.model');
const noteModel = require('../../models/note.model');

const noteResolvers = {
  Query: {
    notes: async () =>await noteModel.find()
  },
  Mutation: {
    //getNotes Mutation
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
    // createnote mutation
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
    //editNote Mutation
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
    //delete Note mutation
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
