# Example of GraphQL with Express NodeJS


This repo holds simple examples of GraphQL API with Express.

## environment

NodeJS version 12+

For NodeJs 12 compatiblity, CommonJS `require` is used instead of ES6 Module.

To use node module `import` instead of `require`:
- In `package.json`, "type" is set to "module"
- Change all `require` to `import` statement
- change `modules.exports = ...` to `export default ...` statement

Run `npm install` before running example scripts.

## Basic graphql server with inline query schema

followed this tutorial:
https://graphql.org/graphql-js/running-an-express-graphql-server/

```sh
npm install express express-graphql graphql --save
npm install node-fetch --save
```

Running `node server.js` will start a GraphQL API server at http://localhost:4000/graphql

In GraphiQL web interface, put query like 
```graphql
{
  hello
  rollDice(numDice: 3)
  getDie(numSides: 6) {
    numSides
    rollOnce
    roll(numRolls: 3)
  }
}
```

A javascript [`client`](./client.js) example shows how to use `fetch` to query graphql.


## Apollo graphql server

The [`apollo-server`](./apollo-server.js) is a simple example of
Apollo graphql server to offer graphql endpoints.

This example is using apollo-server v2.x, so the new way of setting up the
apollo server is adopted.
See: https://www.apollographql.com/docs/apollo-server/migration-two-dot/#apollo-server-2-new-pattern

The [`apollo-server-standalone`](./apollo-server-standalone.js) example shows
Apollo graphql server in stand alone mode without explicitly adding middleware
from Express.


## Person graphql server

This example follows: https://graphql.org/blog/rest-api-graphql-wrapper.

The [`person-server`](./person-server.js) has an external graphql schema 
definition [`person-schema`](./person-schema.js) file, 
where schema is created prorammatically with GraphQL Types.

Run `node person-server.js`, terminal will display:
`Running a GraphQL API server at http://localhost:5000/graphql`

In GraphiQL web interface, put query like
```graphql
{
  person(id: "1") {
    firstName
    lastName
    email
    age
    friends {
      firstName
      lastName
      age
      friends {
        firstName
        email
      }
    }
  }
}
```

**Note** that the `friends` nesting can go on and on.
And this will cause pathological queries to data backend.

This should be avoided. 
Use [`DataLoader`](https://github.com/graphql/dataloader) lib to cache duplicate REST calls.

The person apollo server is backed by a REST data endpoint based on json-server.

## json-server as backend REST data endpoints

Json server is used and loaded with a `db.json` file as mock backend REST data service.
The seeding `db.json` file is created using [json-generator](https://www.json-generator.com/) online service.

```bash
npm install json-server --save
# start it
node_modules/.bin/json-server -p 3456 --watch db.json
```

Alternatively, run json-server in background mode:
```bash
node_modules/.bin/json-server -p 3456 --watch db.json >> ./json-server.log 2>&1 </dev/null &
# then tail the log
tail -f json-server.log
```

An npm task is also created (in `package.json`) to save typing of the above.
```bash
npm run json-server
```

This generates a `people` resource endpoints: `http://localhost:3456/people`.
Json-server provides both standard CRUDs as well as pagination, sorting, and text search. 
It is nicely explained in this [post](https://blog.eleven-labs.com/en/json-server/) 
and its github [documentation](https://github.com/typicode/json-server).

## person CRUD with apollo graphql server

The [`person-apollo-server`](./person-apollo-server.js) example extends the previous person graphql interface to CRUD use case, 
and uses `apollo-server-express` graphql server lib.

In this exmaple, apollo-server adds `express` as middleware. With `express` we can 
add more middleware such as `cors` to support cross-origin javascript graphql clients.

This example follows the best practice of separating graphql schema defintion 
from resolvers functions.

This example uses the same REST data backend by json-server.

Example grapyql mutation calls are:
```graphql
mutation {
  createPerson(
    email: "test@abc.com",
    firstName: "foo2",
    lastName: "bar2"
  ) {
    email
    firstName
    lastName
  }
}
```
```graphql
mutation {
  deletePerson(
    id: 6
  )
}
```
