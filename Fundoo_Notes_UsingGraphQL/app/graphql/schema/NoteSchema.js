const { gql } = require('apollo-server');

module.exports = gql(`
    type Note{
        _id:ID!
        Title:String!
        Description:String!
    }
    input NoteInput{
       Title:String!
       Description:String!
    }
    type Query{
        notes:[Note!]!
    }
    type Mutation{
        createNote( input:NoteInput):Note
        }`);
