

## environment

NodeJS version 13+
Use node module import instead of ES require.
In `package.json`, "type" is set to "module".


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


## Person graphql server

This example follows: https://graphql.org/blog/rest-api-graphql-wrapper.

The [`person-server`](./person-server.js) has an external graphql schema 
definition [`person-schema`](./person-schema.js) file.

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

This should be avoided. Use `DataLoader` lib to cache duplicate REST calls.


#### json-server as backend REST data endpoints

Json server is used and loaded with a `db.json` file as mock backend REST data service.
The seeding `db.json` file is created using [json-generator](https://www.json-generator.com/) online service.

Switch code to `rest-api` branch, then:
```bash
npm install json-server --save
# start it
node_modules/.bin/json-server -p 3456 --watch db.json
```

Alternatively, run json-server in background:
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




