/**
 * @description   : It is use to establish the connection between the database and apollo-server
 * @package       : express.
 * @file          : server.js
 * @author        : Arka Parui
*/
const { ApolloServer } = require('apollo-server-express');
const graphqlSchema = require('./app/graphql/schema/index');
const graphqlResolver = require('./app/graphql/resolvers/index');
const dbConfig = require('./config/database.config');
const express = require('express');
const isAuth = require('./app/utilities/middleware/is-auth');
require('dotenv').config();

//establishing database connection
dbConfig.dbConnection();

//creating ApolloServer and declaring schemas,resolvers and context in it
const server = new ApolloServer({

  typeDefs: graphqlSchema,
  resolvers: graphqlResolver,
  context: isAuth
});

//storing express in app
const app = express();

//apply express middleware
server.applyMiddleware({ app });

// listen on port 3000 for incoming requests
app.listen(process.env.PORT, () => {
  console.log('Server is listening on port 3000');
});
