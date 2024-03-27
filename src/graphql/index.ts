import { ApolloServer } from "@apollo/server";
import { User } from "./user/index";
export const createApolloClientServer = async ()=>{
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
             hello: String
            }
            type Mutation{
              ${User.mutations}
            }
        `,
        resolvers: {
          Query: {
            hello: ()=> "Hello from hello",
            ...User.resolvers.queries
          },
          Mutation: {
            ...User.resolvers.mutations
          },
        },
      });
    
      await gqlServer.start();
      return gqlServer;
}