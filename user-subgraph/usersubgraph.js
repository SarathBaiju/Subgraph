const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key", "@shareable"])

  type Query {
    me: User,
    mes: [User]
  }

  type User @key(fields: "id") {
    id: ID!
    username: String
  }
`;

var users = [
    {id: 1, username: 'sarath'},
    {id: 2, username: 'arjun'},
    {id: 3, username: 'nandu'}
]

const resolvers = {
  Query: {
    me() {
      return { id: "1", username: "@ava" }
    },
    mes() {
        return users
    }
  },
  User: {
    __resolveReference(user, { fetchUserById }){
      return fetchUserById(user.id)
    }
  }
}

function fetchUserById(id){
  return users.find(u => u.id == id);
}

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});