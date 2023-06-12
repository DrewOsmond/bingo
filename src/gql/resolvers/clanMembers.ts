import {
  Arg,
  Mutation,
  Resolver,
  UseMiddleware,
  Ctx,
  //   Query,
  ObjectType,
  Field,
} from "type-graphql";
import { Context } from "../../types";
import { Clan } from "../../entity/clan";
import { authorize } from "../../util/auth/authenticate";
import { db } from "../../db";
import { ClanMember } from "../../entity/clanMembers";

@ObjectType()
class ClanMemberResponse {
  @Field({ nullable: true })
  clanMember: ClanMember;

  @Field({ nullable: true })
  error: string;
}

@Resolver(Clan)
export default class ClanResolver {
  @UseMiddleware(authorize)
  @Mutation(() => ClanMemberResponse)
  async apply(@Arg("id") id: string, @Ctx() ctx: Context) {
    if (!ctx.user) {
      return {
        error: "not authorized",
      };
    }
    const clan = await db.clans.findOne({
      where: {
        id: id,
      },
    });

    if (!clan) {
      return {
        error: "Not a valid clan",
      };
    }

    const application = new ClanMember({
      user: ctx.user,
      clan,
    });

    try {
      const newPendingMember = await application.save();

      return newPendingMember;
    } catch (e) {
      return { error: e };
    }
  }

  //   @UseMiddleware(authorize)
  //   @Query(() => [Clan])
  //   async clanMembers(@Arg("id") id: string) {}
}
