import { ObjectType, Field } from "type-graphql";

@ObjectType()
export default class GQLError {
  @Field(() => String, { nullable: true })
  base?: string;
}
