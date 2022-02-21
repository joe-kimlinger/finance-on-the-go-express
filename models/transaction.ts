import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { TransactionStatus } from "../classes/transaction_status_enum";
import { User } from "./user";
  
@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.sentTransactions)
    sender!: User;

    @ManyToOne(() => User, user => user.receivedTransactions)
    receiver!: User;

    @Column('float', {nullable: false})
    transactionAmount!: number;

    @Column('int', {nullable: false})
    transactionStatus!: TransactionStatus;

    @Column('timestamp', {nullable: false})
    transactionDate!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}