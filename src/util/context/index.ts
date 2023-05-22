import { Request, Response } from "express";
import { Context } from "../../types";
import { verifyJwt } from "../auth/token";

interface CtxArgs {
  req: Request;
  res: Response;
}

export const context = async ({ req, res }: CtxArgs): Promise<Context> => {
  const bearer = req?.signedCookies?.bearer || req.headers.authorization;
  const context: Context = {
    req,
    res,
  };

  const session = await verifyJwt(bearer);

  if (session?.id) {
    context.token = session;
  }

  return context;
};
