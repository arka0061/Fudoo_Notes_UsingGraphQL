const { ApolloServer } = require('apollo-server-express');
const graphqlSchema = require('./app/graphql/schema/index');
const graphqlResolver = require('./app/graphql/resolvers/index');
const dbConfig = require('./config/database.config');
const express = require('express');
const isAuth = require('./app/utilities/middleware/is-auth');
require('dotenv').config();

dbConfig.dbConnection();

const server = new ApolloServer({

  typeDefs: graphqlSchema,
  resolvers: graphqlResolver,
  context: isAuth
});

const app = express();
// app.use(isAuth);
server.applyMiddleware({ app });



app.listen(process.env.PORT, () => {
  console.log('Server is listening on port 3000');
});
