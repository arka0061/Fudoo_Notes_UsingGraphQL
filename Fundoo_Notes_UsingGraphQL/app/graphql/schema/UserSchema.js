const { gql } = require('apollo-server-express');

module.exports = gql(`
    type User{
        _id:ID!
        firstName:String!
        lastName:String!
        email:String!
        password:String!
    }
    input UserInput{
        firstName:String!
        lastName:String!
        email:String!
        password:String!
    }
    input LoginInput{     
        email:String!
        password:String!
    }
    input ForgotPass
    {
        email:String!
    }
    input ResetPass
    {
        mailcode:String!
        newpassword:String!
    }
    type forgotReturn
    {
        email:String
    }
    type resetReturn
    {
        email:String
        newpassword:String
    }
    type authUser
    {
        _id:ID
        token:String
        firstName:String
        lastName:String
        email:String
        getNotes:[Note]!
    }
    type Note{
        title:String
        description:String
    }
    input NoteInput{
       title:String!
       description:String!
    }
    input NoteEdit
    {   noteId:String!
        title:String
        description:String
    }
    input DeleteNote
    {
        noteId:String!
    }
    input LabelInput
    {
        noteID:ID!
        labelname:String!
    }
    type Label
    {
        labelname:String
    }
    input EditLabel
    {
        labelname:String!
        newlabelname:String!
    }
    input DeleteLabelInput
    {
        noteID:ID
        labelname:String!
    }
    type GetLabels
    {
        _id:ID
        userId:String
        noteId:[String]
        labelName:String
    }
    type Query{
        users:[User!]!
        notes:[Note!]!
        getLabel:[GetLabels!]!
    }
    input SearchLabel
    {
        labelname:String!
    }
    type SearchLabelReturn
    {
       _id:String
       emailId:String
       title:String
       description:String
    }
    type Mutation{
        searchLabel(input:SearchLabel):[SearchLabelReturn]
        editLabel(input:EditLabel):Label
        createLabel(input:LabelInput):Label
        deleteLabel(input:DeleteLabelInput):Label
        getNotes:[Note!]!
        createNote( input:NoteInput):Note
        editNote(input:NoteEdit):Note
        deleteNote(input:DeleteNote):Note
        createUser( input:UserInput):User
        forgotpassword( input:ForgotPass):forgotReturn
        loginUser( input:LoginInput):authUser
        resetpassword(input:ResetPass):resetReturn       
        }`);