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
    input ForgotPass
    {
        email:String!
    }
    input ResetPass
    {
        email:String
        mailcode:String
        newpassword:String
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
        forgotpassword( forgetInput:ForgotPass):errorStatus
        loginUser( loginInput:LoginInput):authUser
        resetpassword(resetInput:ResetPass):errorStatus
    }
        schema {
            query:RootQuery
            mutation:RootMutation

        }`)