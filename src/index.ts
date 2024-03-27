import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { createApolloClientServer } from "./graphql";

const init = async () => {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Hello from home-page" });
  });

  app.use("/graphql", expressMiddleware(await createApolloClientServer()));

  app.listen(8000, () => console.log("Server is running"));
};

init();
