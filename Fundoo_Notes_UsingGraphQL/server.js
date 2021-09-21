const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./app/graphql/schema/index.js');
const graphqlResolver = require('./app/graphql/resolvers/index.js')
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const dbConfig = require('./config/database.config.js');
dbConfig.dbConnection();

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}));

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});