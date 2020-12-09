import express from 'express';
import { graphqlHTTP } from 'express-graphql';

// in package.json, set "type" to "module"
import schema from './person-schema.js';

const app = express();
app.use(graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(5000);
console.log('Running a GraphQL API server at http://localhost:5000/graphql');




