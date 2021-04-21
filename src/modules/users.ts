import express from "express";
import { User } from "../entities/User";

export const getUser = async (req: express.Request, res: express.Response) => {
  console.log(req.query);
  const user = await User.findOne(req.query);
  console.log(user);
  if (user) {
    console.log("here u go");
    res.json(user);
  } else {
    res.json({ killme: true });
  }
};

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
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
};
