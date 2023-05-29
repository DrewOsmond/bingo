import { MiddlewareFn } from "type-graphql";
import { Context } from "../../types";
import { db } from "../../db";

export const authorize: MiddlewareFn<Context> = async ({ context }, next) => {
  const session = context.token;

  if (!session) {
    throw new Error("not authorized");
  }
  const user = await db.users.findOneBy({
    id: session.id,
  });

  if (!user) {
    throw new Error("not authorized");
  }

  if (
    user.passwordChangedAt &&
    new Date(session.issuedOn) < user.passwordChangedAt
  ) {
    context.res.clearCookie("bearer");
    throw new Error("not authorized");
  }

  context.user = user;
  return next();
};
