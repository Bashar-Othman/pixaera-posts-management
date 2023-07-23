import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Exclude } from "class-transformer";

import { User } from "../../user/user.entity";

@Entity()
export class PostM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: false })
  is_active: boolean;

  @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
  @Exclude()
  owner: User | number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
