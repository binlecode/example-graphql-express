
// use node module import, in package.json set "type" to "module"

// const express = require('express');
import express from 'express';
// const { graphqlHTTP } = require('express-graphql');
import { graphqlHTTP } from 'express-graphql';
// const { buildSchema } = require('graphql');
import { buildSchema } from 'graphql';


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    hello: String
    rollDice(numDice: Int!, numSides: Int): [Int]
    getDie(numSides: Int): RandomDie
  }
`);

// use object type in graphql with class definition
class RandomDie {
  constructor(numSides = 6) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * (this.numSides));
  }

  roll({ numRolls }) {
    console.log(`numRolls => ${numRolls}`);
    let output = [];
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  rollDice: (args) => {
    var output = [];
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  },
  getDie: (args) => {
    return new RandomDie(args.numSides);
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // turn on gaphiql for dev mode
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');


