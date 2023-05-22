import { buildSchema } from "type-graphql";

import UserResolver from "./resolvers/users";

const schema = buildSchema({
  resolvers: [UserResolver],
});

export default schema;
