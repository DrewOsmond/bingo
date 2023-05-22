import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

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
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // constructor({ username, password }: { username: string; password: string }) {
  //   super();
  //   this.username = username;
  //   this.password = password;
  // }
}
