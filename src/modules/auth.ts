import express from "express";
import admin from "firebase-admin";

export const auth = async (
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
