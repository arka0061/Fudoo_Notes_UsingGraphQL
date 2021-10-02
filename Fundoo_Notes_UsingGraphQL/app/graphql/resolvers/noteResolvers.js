const ApolloError = require('apollo-server-errors');
const userModel = require('../../models/user.model');
const noteModel = require('../../models/note.model');
const noteResolvers = {
  Query: {
    notes: async () => await noteModel.find(),
  },
  Mutation: {
    // create note mutation
    createNote: async (_, { input }) => {
      try {
        const existingUser = await userModel.findOne({ email: input.email });
        if (!existingUser) {
          return new ApolloError.UserInputError('User is Not Registered');
        }
        const notemodel = new noteModel({
          title: input.title,
          description: input.description,
          userId: existingUser._id,
        });
        const existingTitle = await noteModel.findOne({ title: input.title });
        if (existingTitle) {
          return new ApolloError.UserInputError('Title Already Exists');
        }
        await notemodel.save();
        return notemodel;
      }
      catch (error) {
        console.log(error);
        return new ApolloError.ApolloError('Internal Server Error');
      }
    }
  }
}
module.exports = noteResolvers;
