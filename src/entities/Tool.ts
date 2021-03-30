import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  url: string;

  @Column()
  author: string;
}
