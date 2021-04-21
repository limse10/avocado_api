import { Entity, Column, PrimaryColumn, BaseEntity, Unique } from "typeorm";

@Entity()
@Unique(["username"])
export class User extends BaseEntity {
  @PrimaryColumn()
  uid: string;

  @Column()
  username: string;
}
