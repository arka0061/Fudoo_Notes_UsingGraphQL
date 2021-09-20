const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema}=require('graphql');
const userModel=require('./app/models/user.model');


const app = express();


app.use(express.urlencoded({ extended: true }))


app.use(express.json())

const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
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

        }`),
    rootValue:{
        users:()=>{
            return userModel.find();
        },
        createUser:(args)=>{
             const usermodel=new userModel({
                firstName:args.userInput.firstName,
                lastName:args.userInput.lastName,
                email:args.userInput.email,
                password:args.userInput.password
            })
            usermodel.save();
            return usermodel;
        }
    },
    graphiql: true
  }));
  
// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});