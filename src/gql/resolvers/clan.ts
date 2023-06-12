import {
  Arg,
  Mutation,
  Resolver,
  UseMiddleware,
  Ctx,
  Query,
  ObjectType,
  Field,
} from "type-graphql";
import { Context } from "../../types";
import { Clan } from "../../entity/clan";
import { authorize } from "../../util/auth/authenticate";
import { GQLError } from "../objects";
import { db } from "../../db";

@ObjectType()
class ClanResponse {
  @Field({ nullable: true })
  clan: Clan;

  @Field({ nullable: true })
  error: GQLError;
}

@Resolver(Clan)
export default class ClanResolver {
  @UseMiddleware(authorize)
  @Mutation(() => ClanResponse)
  async clanCreate(@Arg("name") name: string, @Ctx() ctx: Context) {
    const clan = new Clan({ name, user: ctx.user! });
    try {
      await clan.save();
      return { clan };
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  }

  @UseMiddleware(authorize)
  @Query(() => [Clan])
  async clans(@Ctx() ctx: Context) {
    if (!ctx.user) {
      return null;
    }
    const clans = await db.clans.findBy({
      user: {
        id: ctx.user.id,
      },
    });

    return clans;
  }
}
