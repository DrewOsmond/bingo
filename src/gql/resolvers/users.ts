import {
  Resolver,
  Arg,
  Mutation,
  Query,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User } from "../../entity/user";
import argon2 from "argon2";
import { db } from "../../db";
import { Context } from "../../types";
import { signJwt } from "../../util/auth/token";
import { authorize } from "../../util/auth/authenticate";
import { GQLError } from "../objects";
@ObjectType()
class UserResponse {
  @Field(() => String, { nullable: true })
  error: GQLError;

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export default class UserResolver {
  @UseMiddleware(authorize)
  @Query(() => UserResponse)
  async getMe(@Ctx() ctx: Context) {
    if (!ctx.user) {
      return { error: "not logged in" };
    }

    return { user: ctx.user, error: "" };
  }

  @Mutation(() => UserResponse)
  async signup(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() ctx: Context
  ) {
    const hashedPassword = await argon2.hash(password);
    try {
      const newUser = new User({
        username: username.toLowerCase(),
        password: hashedPassword,
      });

      await newUser.save();
      signJwt(ctx.res, newUser);

      return { user: newUser };
    } catch (e) {
      const error = e as { code: string | number; line: string };

      let errorMsg = "";
      if (error.code === "23505") {
        errorMsg = "username already in use";
      }
      return { error: errorMsg };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() ctx: Context
  ) {
    const user = await db.users.findOneBy({
      username: username,
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }
    const matchedPassword = await argon2.verify(user.password, password);
    if (matchedPassword) {
      signJwt(ctx.res, user);
      return { user };
    }
    return { error: "Invalid email or password" };
  }

  @UseMiddleware(authorize)
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("verifyPassword")
    verifyPassword: string,
    @Arg("newPassword")
    newPassword: string,
    @Ctx() ctx: Context
  ) {
    if (!ctx.user) {
      return { error: "Not authorized" };
    }
    const user = await db.users.findOneBy({
      id: ctx.user.id,
    });
    if (!user) {
      return { error: "not a valid user" };
    }
    const matchedPassword = await argon2.verify(user.password, verifyPassword);
    if (!matchedPassword) {
      return { error: "password does not match current password" };
    }
    const newPasswordHash = await argon2.hash(newPassword);
    user.password = newPasswordHash;
    user.passwordChangedAt = new Date();
    try {
      await user.save();

      return { user };
    } catch (e) {
      return { error: e };
    }
  }
}
