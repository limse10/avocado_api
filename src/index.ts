import express from "express";
import "reflect-metadata";
import cors from "cors";
import { join } from "path";

import { createConnection } from "typeorm";
import { Tool } from "./entities/Tool";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "Avocado",
    username: "postgres",
    password: "postgres",
    entities: [join(__dirname, "./entities/*.*")],
    logging: true,
    synchronize: true,
  });

  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("hello");
  });

  app.listen(3001, () => {
    console.log("listening on localhost:3001");
  });
};

main();
