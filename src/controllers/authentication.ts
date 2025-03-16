import express from "express";
import { createUser, getUserByEmail, getUserByUserId } from "../db/user";
import { authentication } from "../helpers";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../libs/prisma";
import { User } from "@prisma/client";
import { get } from "lodash";

dotenv.config();

const generateTokens = (user: User, res: express.Response) => {
  const accessToken = jwt.sign(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  

  return {accessToken, refreshToken};
};

export const me = async (req: express.Request, res: express.Response) => {
  try {
    const identity = get(req, "identity.user");

    console.log("Identity", identity);

    if (!identity) return res.status(403).json({ message: "Unauthorized" });

    const { id, email } = identity;

    if (!email || !id) {
      return res.sendStatus(400);
    }

    const user = await getUserByUserId(id);

    console.log("User Fournd", user);

    if (!user) {
      return res.sendStatus(400);
    }

    const accessToken = jwt.sign(
      {
        user
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );

    console.log("AccessToken",  accessToken);

    return res.status(200).json({ accessToken, user }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.email, password);

    if (user.password != expectedHash) {
      return res.sendStatus(403);
    }

    const {accessToken} = generateTokens(user, res);

    return res.status(200).json({ accessToken, user }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password, profileImage, coverImage } = req.body;
    if (!name || !email || !password) return res.sendStatus(401);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = email;
    const user = await createUser({
      email,
      name,
      password: authentication(salt, password),
      profileImage,
      coverImage
    });

    const accessToken = generateTokens(user, res);

    return res.status(200).json({ accessToken, user }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const refresh = async (req: express.Request, res: express.Response) => {
  const cookies = req.cookies;

  // if (!cookies?.jwt) return res.status(403).json({ message: [...cookies] });

  if (!cookies?.jwt) return res.status(403).json({ message: Object.entries(cookies || {}) });

  const refreshToken = cookies.jwt;

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err: any, decoded: any) => {
          if (err) reject(err);
          resolve(decoded);
        }
      );
    });

    const foundedUser = await prisma.user.findFirst({
      where: {
        id: (decoded as any).id,
      },
    });

    if (!foundedUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign(
      {
        user: {
          id: foundedUser.id,
          name: foundedUser.name,
          email: foundedUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204);

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({ message: "Cookie cleared" });
};
