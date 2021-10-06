const ApolloError = require('apollo-server-errors');
const userModel = require('../../models/user.model');
const noteModel = require('../../models/note.model');
const noteResolvers = {
  Query: {
    notes: async () => await noteModel.find(),
  },
  Mutation: {
    // create note mutation
    createNote: async (_, { input },context) => {
      try {
        if (!context.id){      
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const existingUser = await userModel.findOne({ email: context.email });
        const notemodel = new noteModel({
          title: input.title,
          description: input.description,
          userId: existingUser._id,
        });
        const existingTitle = await noteModel.find({ title: input.title });
        let index = 0;
        while (index < existingTitle.length) {
          if (existingUser.id === existingTitle[index].userId) {
            return new ApolloError.UserInputError('Title Already Exists');
          }
          index++;
        }
        await notemodel.save();
        return notemodel;
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    },
    //editNote Mutation
    // editNote: async (_, { input }) => {
    //   try {
    //     const existingUser = await userModel.findOne({ email: input.email });
    //     if (!existingUser) {
    //       return new ApolloError.UserInputError('User is Not Registered');
    //     }
    //     const notemodel = new noteModel({
    //       title: input.title,
    //       description: input.description,
    //       userId: existingUser._id,
    //     });
    //     const existingTitle = await noteModel.findOne({ title: input.title });
    //     if (existingTitle) {

    //     }
    //     await notemodel.save();
    //     return notemodel;
    //   }
    //   catch (error) {
    //     console.log(error);
    //     return new ApolloError.ApolloError('Internal Server Error');
    //   }
    // },
    deleteNote: async (_, { input },context) => {
      try {
        if (!context.id){      
          return new ApolloError.AuthenticationError('UnAuthenticated');
        }
        const existingUser = await userModel.findOne({ email: context.email });
        const checkNotes = await noteModel.find({ userId: existingUser._id });
        if (!checkNotes) {
          return new ApolloError.UserInputError('User has not created any notes till now');
        }
        const findNotesWithTitle = await noteModel.find({ title: input.title });
        if (findNotesWithTitle.userId === checkNotes.userId) {
          var notesToBeDeleted = findNotesWithTitle
        }
        if (notesToBeDeleted.length === 0) {
          return new ApolloError.UserInputError('Note with the given title does not exist');
        }
        //console.log(notesToBeDeleted)
        let index = 0;
        while (index < notesToBeDeleted.length) {
          if (existingUser.id === notesToBeDeleted[index].userId) {
            await noteModel.findByIdAndDelete(notesToBeDeleted[index]);
            return ({
              title: notesToBeDeleted[index].title,
              description: notesToBeDeleted[index].description
            })
          }
          index++;
        }
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    }
  }
}
module.exports = noteResolvers;
