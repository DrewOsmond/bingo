import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  // Index,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user";
import { Clan } from "./clan";

type ActiveStatus = "applied" | "active" | "inactive";

@ObjectType()
@Entity("ClanMembers")
export class ClanMember extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  role: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.clanMembers)
  user: User;

  @Field(() => Clan)
  @ManyToOne(() => Clan, (clan) => clan.clanMember)
  clan: Clan;

  @Field()
  @Column()
  active: ActiveStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(values?: ClanMemberCreateInfo) {
    super();

    if (!values) return;

    this.clan = values.clan;
    this.user = values.user;
  }
}

interface ClanMemberCreateInfo {
  user: User;
  clan: Clan;
}
