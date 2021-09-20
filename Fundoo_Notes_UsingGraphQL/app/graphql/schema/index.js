const { buildSchema } = require('graphql');
module.exports=buildSchema(`
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
    type RootQuery{
        users:[User!]!
    }
    type RootMutation{
        createUser( userInput:UserInput):User
    }
        schema {
            query:RootQuery
            mutation:RootMutation

        }`)