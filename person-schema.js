// import {
//     GraphQLInt,
//     GraphQLList,
//     GraphQLObjectType,
//     GraphQLSchema,
//     GraphQLString
// } from 'graphql';

const {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} = require('graphql');

// import fetch from 'node-fetch';
const fetch = require('node-fetch');

// this is the REST data endpoint
const BASE_URL = 'http://localhost:3456';

function getPersonByUrl(relativeUrl) {
    // fetch(`${BASE_URL}/people/${args.id}/`)
    return fetch(`${BASE_URL}${relativeUrl}`)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            // let p = json.person;
            return json;
        });
}

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: '...',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString,
            // this resolver is to fit field name mismatch
            resolve: (person) => person.first_name
        },
        lastName: {
            type: GraphQLString,
            resolve: (person) => person.last_name
        },
        email: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        friends: {
            type: new GraphQLList(PersonType),
            // friends list of person ids: [1, 2, ..]
            resolve: (person) => person.friends.map(
                (fId) => getPersonByUrl(`/people/${fId}`)
            )
        }
    })
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: () => ({
        person: {
            type: PersonType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            // resolve can take a promise!
            resolve: (root, args, context, info) => getPersonByUrl(`/people/${args.id}/`)
        }
    })
})

// export default new GraphQLSchema({
module.exports = new GraphQLSchema({
    query: QueryType
});