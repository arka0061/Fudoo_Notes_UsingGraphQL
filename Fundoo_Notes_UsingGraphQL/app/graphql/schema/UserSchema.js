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
    input LoginInput{     
        email:String!
        password:String!
    }
    type authUser
    {
        _id:ID
        token:String
        firstName:String
        success:Boolean!
        message:String!
    }
    type errorStatus
    {
        success:Boolean!
        message:String!
    }
    type RootQuery{
        users:[User!]!
    }
    type RootMutation{
        createUser( userInput:UserInput):errorStatus
        loginUser( loginInput:LoginInput):authUser
    }
        schema {
            query:RootQuery
            mutation:RootMutation

        }`)