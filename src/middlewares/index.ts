import express from "express";

import jwt from "jsonwebtoken";
import { merge } from "lodash";

export const verifyJWT = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(403).json({ message: "Forbidden" });
      }
      
      console.log("Verify successfull");

      merge(req, { identity: decoded });
      next();
    });
  } catch (error) {
    console.error("JWT Middleware Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
