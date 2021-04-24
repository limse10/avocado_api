import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  Unique,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Tool } from "./Tool";
@Entity()
@Unique(["username"])
export class User extends BaseEntity {
  @PrimaryColumn()
  uid: string;

  @Column()
  username: string;

  @ManyToMany(() => Tool)
  @JoinTable()
  starred: Tool[];
}
