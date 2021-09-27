const { ApolloServer } = require('apollo-server');
const graphqlSchema = require('./app/graphql/schema/index');
const graphqlResolver = require('./app/graphql/resolvers/index');
const dbConfig = require('./config/database.config');
require('dotenv').config();

dbConfig.dbConnection();

const server = new ApolloServer({

  typeDefs: graphqlSchema,
  resolvers: graphqlResolver,

});

server.listen(process.env.PORT, () => {
  console.log('Server is listening on port 3000');
});
