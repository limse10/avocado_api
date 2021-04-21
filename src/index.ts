import express from "express";
import "reflect-metadata";
import cors from "cors";

import { join } from "path";
import { createConnection } from "typeorm";

import * as users from "./modules/users";
import * as tools from "./modules/tools";
import * as auth from "./modules/auth";

// import { kMaxLength } from "node:buffer";
import admin from "firebase-admin";
import firebase from "firebase";
const serviceAccount = require("../serviceAccount.json");
import { config } from "./config";

firebase.initializeApp(config);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

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

  app.get("/user", users.getUser);

  app.post("/register", auth.auth, users.registerUser);

  app.post("/upload", auth.auth, tools.uploadTool);

  app.get("/ls", tools.listTools);

  app.get("/tool", tools.listTools);

  app.listen(3001, () => {
    console.log("Listening on localhost:3001");
  });
};

main();
