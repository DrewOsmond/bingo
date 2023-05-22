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
//   import prisma from "../../../util/context";
//   import { User } from "../../models";
// improt {User } from "."
//   import { isUniqueEmail } from "../../../util/validation/users";
import { Context } from "../../types";
import { signJwt } from "../../util/auth/token";
import { authorize } from "../../util/auth/authenticate";
@ObjectType()
class UserResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}

// @ObjectType()
// class Error {
//   @Field(() => String, { nullable: true })
//   error!: string | null;
// }

// @ObjectType()
// class isUnique {
//   @Field(() => Boolean, { nullable: true })
//   unique!: boolean;
//   @Field(() => String, { nullable: true })
//   error!: string;
// }

@Resolver(User)
class UserResolver {
  //   @Query(() => isUnique)
  //   async uniqueEmail(@Arg("email") email: string) {
  //     const emailInUse = await isUniqueEmail(email);
  //     if (emailInUse) {
  //       return { error: "email already in use" };
  //     }
  //     return { base: true };
  //   }
  @UseMiddleware(authorize)
  @Query(() => UserResponse)
  async getMe(@Ctx() ctx: Context) {
    if (!ctx.user) {
      return { error: "not logged in" };
    }
    console.log(ctx.user, "RETURNING USER");
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
      const newUser = new User();
      newUser.username = username.toLowerCase();
      newUser.password = hashedPassword;
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
  //   @Mutation(() => UserResponse)
  //   async login(
  //     @Arg("email") email: string,
  //     @Arg("password") password: string,
  //     @Ctx() ctx: Context
  //   ) {
  //     const user = await prisma.users.findUnique({ where: { email } });
  //     if (!user) {
  //       return { error: "Invalid email or password" };
  //     }
  //     const matchedPassword = await argon2.verify(user.password, password);
  //     if (matchedPassword) {
  //       signJwt(ctx.res, user);
  //       return { user };
  //     }
  //     return { error: "Invalid email or password" };
  //   }
  //   @Mutation(() => Error)
  //   async changePassword(
  //     @Arg("verifyPassword")
  //     verifyPassword: string,
  //     @Arg("newPassword")
  //     newPassword: string,
  //     @Ctx() ctx: Context
  //   ) {
  //     if (!ctx.user) {
  //       return { error: "Not authorized" };
  //     }
  //     const user = await prisma.users.findUnique({
  //       where: { id: ctx.user.id },
  //     });
  //     if (!user) {
  //       return { error: "not a valid user" };
  //     }
  //     const matchedPassword = await argon2.verify(user.password, verifyPassword);
  //     if (!matchedPassword) {
  //       return { error: "password does not match current password" };
  //     }
  //     const newPasswordHash = await argon2.hash(newPassword);
  //     await prisma.users.update({
  //       where: { id: ctx.user.id },
  //       data: {
  //         password: newPasswordHash,
  //         passwordChangedAt: new Date(),
  //       },
  //     });
  //     return { error: null };
  //   }
}

export default UserResolver;
