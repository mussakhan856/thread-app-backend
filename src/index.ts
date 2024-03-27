import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

const init = async () => {
  const app = express();
  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
        }
    `,
    resolvers: {
        Query: {
            hello: ()=> "Hey There i am a graphql"
        }
    },
  });

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Hello from home-page" });
  });
  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(8000, () => console.log("Server is running"));
};

init();
