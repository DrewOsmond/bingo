import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user";
import { ClanMember } from "./clanMembers";

@ObjectType()
@Entity("Clans")
@Index(["name"], { unique: false })
export class Clan extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ default: () => "true" })
  public: boolean;

  @ManyToOne(() => User, (user) => user.clans)
  user: User;

  @OneToMany(() => ClanMember, (member) => member.clan)
  clanMember: ClanMember[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(values?: ClanCreateInfo) {
    super();
    if (values?.name) {
      this.name = values.name;
    }
    if (values?.user) {
      this.user = values.user;
    }
  }
}

interface ClanCreateInfo {
  name: string;
  user: User;
}
