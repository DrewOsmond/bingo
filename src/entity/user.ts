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

@ObjectType()
@Entity("Users")
@Index(["username"], { unique: true })
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  passwordChangedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Clan, (clan) => clan.user)
  clans: Clan[];

  constructor(values?: UserCreateInfo) {
    super();
    if (values?.username) {
      this.username = values.username;
    }

    if (values?.password) {
      this.password = values.password;
    }
  }
}

interface UserCreateInfo {
  username: string;
  password: string;
}
