import { Request, Response } from "express";
import { User } from "./entity/user";

export interface Context {
  req: Request;
  res: Response;
  token?: JwtPayloadValue;
  user?: User;
}

export interface JwtPayloadValue {
  id: string;
  issuedOn: Date;
}
