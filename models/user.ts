import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
import { Transaction } from "./transaction";
  
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    email!: string;

    @OneToMany(() => Transaction, (transaction: Transaction) => transaction.sender)
    sentTransactions!: Array<Transaction>;

    @OneToMany(() => Transaction, (transaction: Transaction) => transaction.receiver)
    receivedTransactions!: Array<Transaction>;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}