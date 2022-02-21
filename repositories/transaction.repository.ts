import { getRepository, QueryFailedError, Between, MoreThanOrEqual } from "typeorm";
import { TransactionStatus } from "../classes/transaction_status_enum";
import { Transaction, User } from "../models";

export interface ITransactionPayload {
    sender: User;
    receiver: User;
    transactionDate: Date;
    transactionAmount: number;
    transactionStatus: TransactionStatus;
}

export const getTransactions = async (startDate: Date, endDate: Date, userId: number): Promise<Array<Transaction | QueryFailedError>> => {
    const transactionRepository = getRepository(Transaction);
    return transactionRepository.find({
        where: [
            { 
                transactionDate: Between(startDate, endDate),
                sender: {id: userId} as User,
                transactionStatus: TransactionStatus.Completed
            },
            { 
                transactionDate: Between(startDate, endDate),
                receiver: {id: userId} as User,
                transactionStatus: TransactionStatus.Completed
            }
            
        ],
        relations: ["sender", "receiver"]
    }).catch(err => err);
};

export const createTransaction = async (payload: ITransactionPayload): Promise<Transaction | QueryFailedError> => {
    const transactionRepository = getRepository(Transaction);
    const transaction = new Transaction();
    return transactionRepository.save({
        ...transaction,
        ...payload,
    }).catch(err => err);
};

export const createTransactions = async (payload: ITransactionPayload[]): Promise<Transaction[] | QueryFailedError> => {
    const transactionRepository = getRepository(Transaction);
    const transaction = new Transaction();
    const saveRequests = payload.map((body) => { return {...transaction, ...body} })
    return transactionRepository.save(saveRequests).catch(err => err);
};

export const getTransaction = async (id: number): Promise<Transaction | null | QueryFailedError> => {
    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.findOne({ id: id });
    if (!transaction) return null;
    return transaction;
};