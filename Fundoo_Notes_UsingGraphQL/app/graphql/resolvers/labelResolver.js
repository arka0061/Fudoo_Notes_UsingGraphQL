const ApolloError = require('apollo-server-errors');
const userModel = require('../../models/user.model');
const noteModel = require('../../models/note.model');
const labelModel = require('../../models/label.model');
const { findById } = require('../../models/user.model');
const mongoose = require('mongoose');

const labelResolvers = {
    Mutation: {
        // createlabel mutation
        createLabel: async (_, { input }, context) => {
            try {
                if (!context.id) {
                    return new ApolloError.AuthenticationError('UnAuthenticated');
                }
                // labelModel.
                // findOne({ labelName: input.labelname }).
                // populate('noteId').
                // exec(function (err, test) {
                //     if (err) return handleError(err);
                //     console.log(test.noteId);

                // });
                const checkNote = await labelModel.findOne({ noteId: input.noteID });
                if (checkNote) {
                    return new ApolloError.UserInputError('This note is already added');
                }
                const checkLabel = await labelModel.findOne({ labelName: input.labelname });
                //console.log(checkLabel)
                if (checkLabel) {
                    checkLabel.noteId.push(input.noteID)
                    await checkLabel.save();
                    return ({
                        labelname: input.labelname
                    })
                }
                const labelmodel = new labelModel({
                    userId: context.id,
                    noteId: input.noteID,
                    labelName: input.labelname,
                });

                //labelmodel.noteId.push(input.noteID)
                await labelmodel.save();
                return ({
                    labelname: input.labelname
                })
            }
            catch (error) {
                console.log(error);
                return new ApolloError.ApolloError('Internal Server Error');
            }
        },
        //deleteLabel mutation
        deleteLabel: async (_, { input }, context) => {
            try {
                if (!context.id) {
                    return new ApolloError.AuthenticationError('UnAuthenticated');
                }
                const checkLabel = await labelModel.findOne({ labelName: input.labelname });
                if (!checkLabel) {
                    return new ApolloError.UserInputError('Label is not present');
                }
                const checkNote = await labelModel.findOne({ noteId: input.noteID });
                if (!checkNote) {
                    await labelModel.findByIdAndDelete(checkLabel.id);
                }
                //console.log(JSON.stringify(checkNote.noteId[0]))
                let index = 0;
                while (index < checkLabel.noteId.length) {
                    if (JSON.stringify(checkLabel.noteId[index]) === JSON.stringify(input.noteID)) {
                        let itemToBeRemoved = checkLabel.noteId[index];
                        await labelModel.findOneAndUpdate(
                            {
                                labelName: input.labelname
                            },
                            {
                                $pull: {
                                    noteId: itemToBeRemoved
                                },
                            }
                        )
                        return ({
                            labelName: "Deleted"
                        })
                    }
                    index++;
                }
                return new ApolloError.UserInputError('Note not found');
            }
            catch (error) {
                console.log(error);
                return new ApolloError.ApolloError('Internal Server Error');
            }
        }
    }
}
module.exports = labelResolvers;
