import { MiddlewareFn } from "type-graphql";
import { Context } from "../../types";
import { User } from "../../entity/user";
import { AppDataSource } from "../..";

export const authorize: MiddlewareFn<Context> = async ({ context }, next) => {
  const session = context.token;
  if (!session) {
    throw new Error("not authorized");
  }
  const user = await AppDataSource.getRepository(User).findOneBy({
    id: session.id,
  });

  //   console.log(user);
  if (!user) {
    throw new Error("not authorized");
  }

  // if (user.passwordChangedAt && session.issuedOn < user.passwordChangedAt) {
  //     context.res.clearCookie("bearer");
  //     throw new Error("not authorized");
  //   }
  //   context.user = user;
  return next();
};
