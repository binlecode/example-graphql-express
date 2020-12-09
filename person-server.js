// import express from 'express';
const express = require('express');
// import { graphqlHTTP } from 'express-graphql';
const { graphqlHTTP } = require('express-graphql');

// import schema from './person-schema.js';
const schema = require('./person-schema')

const app = express();
app.use(graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(5000);
console.log('Running a GraphQL API server at http://localhost:5000/graphql');
