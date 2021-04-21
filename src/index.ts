import express from "express";
import "reflect-metadata";
import cors from "cors";

import { join } from "path";
import bodyParser from "body-parser";
import { Connection, createConnection } from "typeorm";
import { Tool } from "./entities/Tool";
import { User } from "./entities/User";

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

  const auth = async (
    req: express.Request,
    res: express.Response,
    next: any
  ) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const idToken = req.headers.authorization.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      return next();
    } else {
      return res.status(403).json({ error: "unauthorized" });
    }
  };

  app.get("/", (_req, res) => {
    res.send("hello");
  });

  app.get("/user", async (req, res) => {
    console.log(req.query);
    const user = await User.findOne(req.query);
    console.log(user);
    if (user) {
      console.log("here u go");
      res.json(user);
    } else {
      res.json({ killme: true });
    }
  });

  app.post("/register", auth, async (req, res) => {
    try {
      let user = await User.create({
        uid: req.body.uid,
        username: req.body.username,
      }).save();
      console.log(`User ${req.body.username} created!`);
      res.status(200).json({ general: "user created" });
    } catch (err) {
      if (err.code == 23505) {
        res.status(200).json({ warning: "Username already exists!" });
      } else {
        res.status(500).json({ error: "error" });
      }
    }
  });
  // app.post("/signup", async (req, res) => {
  //   const { email, password } = req.body;
  //   const user = await admin.auth().createUser({ email, password });

  //   return res.send(user);
  // });

  // app.post("/login", async (req, res) => {
  //   const user = {
  //     email: req.body.email,
  //     password: req.body.password,
  //   };
  //   try {
  //     const data = await firebase
  //       .auth()
  //       .signInWithEmailAndPassword(user.email, user.password);
  //     const token = await data?.user?.getIdToken();
  //     return res.json({ token });
  //   } catch (err) {
  //     return res.status(403).json({ general: "wrong login bitch" });
  //   }
  // });

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
