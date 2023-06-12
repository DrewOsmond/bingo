import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Clan } from "./clan";
import { Length } from "class-validator";
import { ClanMember } from "./clanMembers";

@ObjectType()
@Entity("Users")
@Index(["username"], { unique: true })
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  @Length(4, 12, {
    message: "Username must be between 4 and 12 characters",
  })
  username: string;

  @Column()
  @Length(8, 32, {
    message: "Password must be longer than 8 characters",
  })
  password: string;

  @Column({ nullable: true, default: null })
  passwordChangedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Clan])
  @OneToMany(() => Clan, (clan) => clan.user)
  clans: Clan[];

  @Field(() => [ClanMember])
  @OneToMany(() => ClanMember, (clanMember) => clanMember.user)
  clanMembers: ClanMember[];

  constructor(values: UserCreateInfo | undefined) {
    super();
    if (!values) return;

    if (values.username) {
      this.username = values.username;
    }

    if (values.password) {
      this.password = values.password;
    }
  }
}

interface UserCreateInfo {
  username: string;
  password: string;
}
