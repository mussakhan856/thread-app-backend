import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

const init = async () => {
  const app = express();
  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
        }
        type Mutation{
            createUser(firstName: String!, lastName: String, email: String!, password: String!): Boolean
        }
    `,
    resolvers: {
      Query: {
        hello: () => "Hey There i am a graphql",
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          try {
            await prismaClient.user.create({
              data: {
                email,
                firstName,
                lastName,
                password,
                salt: "random_salt",
              },
            });
            return true;
          } catch (error: any) {
            console.log("Error creating user: ", error?.message);
            return false;
          }
        },
      },
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
