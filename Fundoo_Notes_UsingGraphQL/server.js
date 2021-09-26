const graphqlSchema = require('./app/graphql/schema/index.js');
const graphqlResolver = require('./app/graphql/resolvers/index.js')
require('dotenv').config();
const { ApolloServer } = require('apollo-server');

const dbConfig = require('./config/database.config.js');
dbConfig.dbConnection();

const server = new ApolloServer({
	typeDefs:graphqlSchema,
	resolvers:graphqlResolver
});

server.listen(process.env.PORT, () => {
    console.log("Server is listening on port 3000");
});