import express from "express";
import "reflect-metadata";
import cors from "cors";

import { join } from "path";
import bodyParser from "body-parser";
import { Connection, createConnection } from "typeorm";
import { Tool } from "./entities/Tool";
// import { kMaxLength } from "node:buffer";

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
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.send("hello");
  });

  app.post("/upload", async (req, res) => {
    let tool = await Tool.create({
      name: req.body.name,
      description: req.body.description,
      url: req.body.url,
      author: req.body.author,
      category: req.body.category,
    }).save();
    console.log(`Tool ${req.body.name} created!`);
    res.sendStatus(200);
  });

  app.get("/ls", async (req, res) => {
    let tools = await Tool.find();
    res.send({ tools });
  });

  app.get("/tool", async (req, res) => {
    const tool = await Tool.findOne(req.query);
    res.json(tool);
  });

  app.listen(3001, () => {
    console.log("Listening on localhost:3001");
  });
};

main();
