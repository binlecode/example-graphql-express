// a simple express server with apollo-server graphql middleware

// npm install apollo-server --save

// significant simplification makde since version 2
// check this guide: 
// https://www.apollographql.com/docs/apollo-server/migration-two-dot/#apollo-server-2-new-pattern

const express = require('express');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql')
const { ApolloServer, gql } = require('apollo-server-express');

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            hello: {
                type: GraphQLString,
                resolve: (root, args, context, info) => {
                    return 'Hello Apollo!';
                }
            }
        }
    })
});

const app = express();

const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

app.listen({ port: 5000}, () => {
    console.log(`Apollo graphql server is running at http://localhost:5000${server.graphqlPath}`);
});

