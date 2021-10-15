const ApolloError = require('apollo-server-errors');
const labelModel = require('../../models/label.model');

const labelResolvers = {
    Query: {
        getLabel: async () => {
            const labels = await labelModel.find()
            return labels
        }
    },
    Mutation: {
        // createlabel mutation
        createLabel: async (_, { input }, context) => {
            try {
                if (!context.id) {
                    return new ApolloError.AuthenticationError('UnAuthenticated');
                }
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
                                labelname: input.labelname
                            },
                            {
                                $pull: {
                                    noteId: itemToBeRemoved
                                },
                            }
                        )
                        return ({
                            labelname: input.labelname
                        })
                    }
                    index++;
                }
                return ({
                    labelname: input.labelname
                })
            }
            catch (error) {
                console.log(error);
                return new ApolloError.ApolloError('Internal Server Error');
            }
        },
        //editLabel mutation
        editLabel: async (_, { input }, context) => {
            try {
                if (!context.id) {
                    return new ApolloError.AuthenticationError('UnAuthenticated');
                }
                const checkLabel = await labelModel.findOne({ labelName: input.labelname });
                if (!checkLabel) {
                    return new ApolloError.UserInputError('Label not found');
                }
                await labelModel.findOneAndUpdate(checkLabel.labelName, {
                    labelName: input.newlabelname
                }, { new: true });
                return ({
                    labelname: input.labelname
                })
            }
            catch (error) {
                console.log(error);
                return new ApolloError.ApolloError('Internal Server Error');
            }
        },
        searchLabel: async (_, { input }, context) => {
            try {
                if (!context.id) {
                    return new ApolloError.AuthenticationError('UnAuthenticated');
                }
                const getLabel = await labelModel.findOne({ labelName: input.labelname });
                if (!getLabel) {
                    return new ApolloError.UserInputError('User has not created any labels');
                }
                const getNotes = await labelModel.
                    findOne({ labelName: input.labelname }).
                    populate('noteId')
                return getNotes.noteId
            }
            catch (error) {
                console.log(error);
                return new ApolloError.ApolloError('Internal Server Error');
            }
        },
    }
}
module.exports = labelResolvers;
