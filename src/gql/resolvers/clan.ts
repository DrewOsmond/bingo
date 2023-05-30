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
    const clans = await db.clans.findBy({
      user: {
        //@ts-ignore adding ignore here - this works fully, not sure where the typing is wrong.
        id: ctx.user!.id,
      },
    });

    return clans;
  }
}
