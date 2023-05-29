import { Arg, Mutation, Resolver, UseMiddleware, Ctx } from "type-graphql";
import { Context } from "../../types";
import { Clan } from "../../entity/clan";
import { authorize } from "../../util/auth/authenticate";

@Resolver(Clan)
export default class ClanResolver {
  @UseMiddleware(authorize)
  @Mutation(() => Clan || null)
  async clanCreate(@Arg("name") name: string, @Ctx() ctx: Context) {
    if (!ctx.user) {
      console.log("???");
      return { error: "Not authorized" };
    }
    console.log("??????");
    const clan = new Clan({ name, user: ctx.user });
    try {
      await clan.save();
      return clan;
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  }
}
