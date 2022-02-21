import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn
  } from "typeorm";
import { User } from "./user";
  
@Entity()
export class Transaction {
    @Column('uuid', {nullable: false, unique: true})
    @PrimaryColumn()
    id!: string;

    @ManyToOne(() => User, user => user.userId, { cascade: true })
    UserId!: User;

    @Column()
    debitOrCredit!: string;

    @Column()
    currency!: string;

    @Column()
    action!: string;

    @Column()
    amount!: number;

    @Column()
    status!: string;

    @Column()
    date!: Date;

    @ManyToOne(() => User, user => user.userId, { cascade: true })
    sender: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}