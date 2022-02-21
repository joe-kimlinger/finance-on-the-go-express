import { getRepository, QueryFailedError, Between, MoreThanOrEqual, Not } from "typeorm";
import { Transaction, User } from "../models";

export interface ITransactionPayload {
    userId: User;
    sender: User;
    date: Date;
    amount: number;
}

export const getTransactions = async (startDate: Date, endDate: Date, userId: number): Promise<Array<Transaction | QueryFailedError>> => {
    const transactionRepository = getRepository(Transaction);
    return transactionRepository.find({
        where: [
            { 
                date: Between(startDate, endDate),
                sender: {userId: userId} as User,
                status: Not('failed')
            },
            { 
                date: Between(startDate, endDate),
                UserId: {userId: userId} as User,
                status: Not('failed')
            }
            
        ],
        relations: ["sender", "UserId"]
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

export const getTransaction = async (id: string): Promise<Transaction | null | QueryFailedError> => {
    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.findOne({ id: id });
    if (!transaction) return null;
    return transaction;
};