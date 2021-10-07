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
        description:String!
    }
    input DeleteNote
    {
        noteId:String!
    }
    type Query{
        users:[User!]!
        notes:[Note!]!
    }
    type Mutation{
        getNotes:[Note!]!
        createNote( input:NoteInput):Note
        editNote(input:NoteEdit):Note
        deleteNote(input:DeleteNote):Note
        createUser( input:UserInput):User
        forgotpassword( input:ForgotPass):forgotReturn
        loginUser( input:LoginInput):authUser
        resetpassword(input:ResetPass):resetReturn       
        }`);