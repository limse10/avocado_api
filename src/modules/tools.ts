import express from "express";
import { Tool } from "../entities/Tool";

export const uploadTool = async (
  req: express.Request,
  res: express.Response
) => {
  let tool = await Tool.create({
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    author: req.body.author,
    category: req.body.category,
  }).save();
  console.log(`Tool ${req.body.name} created!`);
  res.sendStatus(200);
};

export const listTools = async (
  req: express.Request,
  res: express.Response
) => {
  let tools = await Tool.find();
  res.send({ tools });
};

export const getTool = async (req: express.Request, res: express.Response) => {
  const tool = await Tool.findOne(req.query);
  res.json(tool);
};
