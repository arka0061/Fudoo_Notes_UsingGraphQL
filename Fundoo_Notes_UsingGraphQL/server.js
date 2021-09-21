const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./app/graphql/schema/index.js');
const graphqlResolver = require('./app/graphql/resolvers/index.js')
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
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}));

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});