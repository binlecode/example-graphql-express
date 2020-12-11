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
        foos: [Foo]
    }

    type Foo {
        name: String
    }
`; 

// it is recommended to define resolvers separately from the schema
// we can define separate node field resolvers for hello and foos

const helloResolver = {
    Query: {
        hello: () => {
            return 'Hello Apollo is stand-alone !'
        }
    }
};

const fooResolver = {
    Query: {
        foos: () => {
            return [
                { name: 'fist foo' },
                { name: 'second foo'} 
            ]
        }
    }
}

const server = new ApolloServer({ 
    typeDefs, 
    resolvers: [helloResolver, fooResolver] 
});

server.listen({ port: 5000 }).then(({ url }) => {
    console.log(`Apollo graphql server is running at ${url}`);
});

