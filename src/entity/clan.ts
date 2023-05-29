import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user";

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
  @ManyToOne(() => User, (user) => user.clans)
  user: string;

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
      this.user = values.user.id;
    }
  }
}

interface ClanCreateInfo {
  name: string;
  user: User;
}
