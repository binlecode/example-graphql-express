/**
 * An apollo-express server with crud REST backend
 * 
 * Start json-server before running this script
 * `node_modules/.bin/json-server -p 3456 --watch db.json`
 * 
 * See README for more information of json-server.
 */

const fetch = require('node-fetch');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        person(id: Int): Person
        people: [Person]
    }

    type Mutation {
        createPerson(
            firstName: String,
            lastName: String,
            email: String!,
            age: Int
        ): Person

        deletePerson(id: Int!): String
    }

    type Person {
        id: String
        firstName: String
        lastName: String
        email: String
        age: Int
    }
`;

const resolvers = {
    Query: {
        person: (root, args, context, info) => {
            return getPersonById(args.id)
        }
    },
    Mutation: {
        createPerson: (root, args, context, info) => {
            return createPerson(args);
        },
        deletePerson: (root, args, context, info) => {
            return deletePerson(args.id);
        }
    }
};

const BASE_URL = 'http://localhost:3456/people/';

function getPersonById(id) {
    return fetch(`${BASE_URL}${id}`)
        .then(res => res.json())
        .then(json => {
            // field name mismatch b/t person type and data hash keys
            toPersonKeys(json);
            console.log(json);
            return json;
        });
}

function createPerson(opts) {
    toDataKeys(opts);
    console.log('Posting request to json-server with body: ', opts);
    return fetch(BASE_URL, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(opts)
        })
        .then(res => res.json())
        .then(json => {
            toPersonKeys(json)
            console.log('Created Person: ', json);
            return json;
        });
}

/**
 * handle key mismatch b/t person object and REST json data
 */
function toPersonKeys(json) {
    json.firstName = json.first_name;
    json.first_name = undefined;
    json.lastName = json.last_name;
    json.last_name = undefined;
}

function toDataKeys(json) {
    json.first_name = json.firstName;
    json.firstName = undefined;
    json.last_name = json.lastName;
    json.lastName = undefined;
}

function deletePerson(id) {
    return fetch(`${BASE_URL}${id}`, {
        method: 'delete'
    })
    .then(res => res.json())
    .then(json => {
        console.log('Deleted Person: ', id);
        return id;
    });
}

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers
});
server.applyMiddleware({ app });

app.listen({ port: 5000 }, () => {
    console.log(`Apollo graphql server is running at http://localhost:5000${server.graphqlPath}`);
});

