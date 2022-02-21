import { QueryFailedError } from "typeorm";
import { Transaction, User } from "../models";
import {
    createTransaction,
    createTransactions,
    getTransactions,
    ITransactionPayload,
    getTransaction,
} from "../repositories/transaction.repository";

export default class TransactionController {
    public async getTransactions(startDate: Date, endDate: Date, userId: number): Promise<Array<Transaction | QueryFailedError>> {
        return getTransactions(startDate, endDate, userId);
    }

    public async createTransaction(body: ITransactionPayload): Promise<Transaction | QueryFailedError> {
        return createTransaction(body);
    }

    public async createTransactions(body: ITransactionPayload[]): Promise<Transaction[] | QueryFailedError> {
        return createTransactions(body);
    }

    public async getTransaction(id: string): Promise<Transaction | null | QueryFailedError> {
        return getTransaction(id);
    }
}