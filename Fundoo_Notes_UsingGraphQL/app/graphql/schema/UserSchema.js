const { gql } = require('apollo-server');
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
        email:String!
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
    }
    type Query{
        users:[User!]!
    }
    type Mutation{
        createUser( input:UserInput):User
        forgotpassword( input:ForgotPass):forgotReturn
        loginUser( input:LoginInput):authUser
        resetpassword(input:ResetPass):resetReturn       
        }`)

