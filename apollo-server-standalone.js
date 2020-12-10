// a simple express server with apollo-server graphql middleware

// npm install apollo-server --save

// significant simplification makde since version 2
// check this guide: 
// https://www.apollographql.com/docs/apollo-server/migration-two-dot/#stand-alone

const { ApolloServer, gql } = require('apollo-server');


// A typeDefs `String` with the `gql` tag returns an AST
// When not using `makeExecutableSchema` and passing `typeDefs` into the
// `ApolloServer` constructor, it's recommended to use the `gql` tag.
const typeDefs = gql`
    type Query {
        hello: String
    }
`; 

const resolvers = {
    Query: {
        hello: () => {
            return 'Hello Apollo is stand-alone !'
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 5000 }).then(({ url }) => {
    console.log(`Apollo graphql server is running at ${url}`);
});

