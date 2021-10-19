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
                const checkLabel = await labelModel.findOne({ labelName: input.labelname });
                if (checkLabel) {
                    for (index = 0; index < checkLabel.noteId.length; index++) {
                        if (JSON.stringify(checkLabel.noteId[index]) === JSON.stringify(input.noteID)) {
                            return new ApolloError.UserInputError('This note is already added');
                        }
                    }
                    checkLabel.noteId.push(input.noteID)
                    await checkLabel.save();
                    return "Note Pushed Into Existing Label Sucessfully"
                }
                const labelmodel = new labelModel({
                    userId: context.id,
                    noteId: input.noteID,
                    labelName: input.labelname,
                });
                //labelmodel.noteId.push(input.noteID)
                await labelmodel.save();
                return "New Label Created Sucessfully"
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
                await labelModel.findByIdAndDelete(checkLabel.id);
                // return ({
                //     labelname: input.labelname
                // })
                return "Deleted Sucessfully"
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
                if (input.labelname && input.newlabelname != null) {
                    await labelModel.findOneAndUpdate({ labelName: input.labelname }, {
                        labelName: input.newlabelname
                    }, { new: true });
                    return "LabelName Edited Sucessfully"
                }
                const checkNote = await labelModel.findOne({ noteId: input.noteID });
                if (!checkNote) {
                    return new ApolloError.UserInputError('Note not found');
                }
                let index = 0;
                while (index < checkLabel.noteId.length) {
                    if (JSON.stringify(checkLabel.noteId[index]) === JSON.stringify(input.noteID)) {
                        let itemToBeRemoved = checkLabel.noteId[index];
                        console.log(itemToBeRemoved)
                        if(checkLabel.noteId.length===1)
                        {
                            await labelModel.findByIdAndDelete(checkLabel.id);
                            return "Note Removed From Label Sucessfully"
                        }
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
                        return "Note Removed From Label Sucessfully"
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
        //search Label api
        searchLabel: async (_, { input }, context) => {
            try {
                if (!context.id) {
                    return new ApolloError.AuthenticationError('UnAuthenticated');
                }
                const getLabel = await labelModel.find({ labelName: { $regex: input.labelname, $options: 'i' } });
                if (getLabel.length === 0) {
                    return new ApolloError.UserInputError('Label not found');
                }
                let index = 0;
                let array = [];
                let getNotes
                while (index < getLabel.length) {
                    getNotes
                    getNotes = await labelModel.
                        findOne({ labelName: getLabel[index].labelName }).
                        populate('noteId')
                    array.push(getNotes.noteId)
                    index++;
                }
                const newarray = array.flat()
                return ({ getLabelContent: newarray, labels: getLabel })
            }
            catch (error) {
                console.log(error);
                return new ApolloError.ApolloError('Internal Server Error');
            }
        },
    }
}
module.exports = labelResolvers;
