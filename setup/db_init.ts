import fetch from 'node-fetch';
import { TransactionRepository } from 'typeorm';
import { createTransactions } from '../repositories/transaction.repository';

export const loadDatabase = async () => {
    

    const response = await fetch('https://api-v1-staging-eks.fingo.africa/transactions/mock_senior_test');
    const data = await response.json();
    

    let transactions = await createTransactions(data);

    return transactions
}