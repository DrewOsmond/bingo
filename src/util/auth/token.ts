import jwt from "jsonwebtoken";
import { Response } from "express";
import { User } from "../../entity/user";

import * as dotenv from "dotenv";

dotenv.config();
interface JwtPayloadValue {
  id: string;
  issuedOn: Date;
}

const SECRET = process.env.SECRET ?? "";
const inProduction = process.env.NODE_ENV === "production";

export const signJwt = (res: Response, user: User) => {
  const token = jwt.sign({ id: user.id, issuedOn: new Date() }, SECRET, {
    expiresIn: 60 * 60 * 24 * 365 * 1000,
  });

  res.cookie("bearer", token, {
    maxAge: 60 * 60 * 24 * 365 * 1000,
    httpOnly: inProduction,
    sameSite: inProduction && "lax",
    signed: true,
    secure: inProduction,
  });

  return token;
};
export const verifyJwt = (
  token: string
): Promise<JwtPayloadValue | undefined> =>
  new Promise((resolve) => {
    jwt.verify(token, SECRET, {}, (_err, payload) => {
      const jwtPaylod = payload as JwtPayloadValue;
      return resolve(jwtPaylod);
    });
  });
