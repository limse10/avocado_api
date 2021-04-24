import express from "express";
import { User } from "../entities/User";
import { Tool } from "../entities/Tool";

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
export const addStar = async (req: express.Request, res: express.Response) => {
  console.log(req.body);
  const user = await User.findOne({
    relations: ["starred"],
    where: { uid: req.body.uid },
  });
  const tool = await Tool.findOne({ id: req.body.tool });
  if (!user.starred) {
  } else {
    user.starred.push(tool);
  }
  user.save();
  res.send(200);
  // const user = await User.findOne(req.query);
};
export const getStarred = async (
  req: express.Request,
  res: express.Response
) => {
  const user = await User.findOne({
    relations: ["starred"],
    where: { uid: req.query.uid },
  });
  console.log(user);
  res.json(user.starred);
};
