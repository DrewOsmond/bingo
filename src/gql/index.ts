import { buildSchema } from "type-graphql";
import ClanResolver from "./resolvers/clan";

import UserResolver from "./resolvers/users";

const schema = buildSchema({
  resolvers: [UserResolver, ClanResolver],
});

export default schema;
