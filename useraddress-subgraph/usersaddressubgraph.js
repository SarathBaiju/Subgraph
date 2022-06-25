const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key", "@shareable"])

  type Query {
    address: UserAddress
  }

  type UserAddress @key(fields: "id") {
    id: ID!
    userId: ID!
    address: String
  }
`;

 var address = [
     {id:1,userId: 1, username: 'sarath', address: 'test-address-1'},
     {id:2,userId: 2, username: 'arjun', address: 'test-address-2'},
     {id:3,userId: 3, username: 'nandu', address: 'test-address-3'}
 ]

const resolvers = {
  Query: {
    address() {
      return { id: "1", userId: 1, address: "Mnk House" }
    }
  },
  UserAddress: {
     __resolveReference(address, { fetchUserAdressById }){
       return fetchUserAdressById(address.id)
     }
   }
}

 function fetchUserAdressById(id){
   return address.find(u => u.id == id);
 }

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});