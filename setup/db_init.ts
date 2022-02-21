import { QueryFailedError } from "typeorm";
import { TransactionStatus } from "../classes/transaction_status_enum";
import { User } from "../models";
import { createTransactions, ITransactionPayload } from "../repositories/transaction.repository";
import { createUsers, IUserPayload } from "../repositories/user.repository";

let numUsers = 5;
let numTransactions = 20;
let i: number;

function randomString(length: number = 10): string {
    let strArr: string[] = [];
    for (let i: number = 0; i < length; i++){
        strArr.push(String.fromCharCode(97 + Math.round(Math.random() * 25)))
    }
    return strArr.join('');
}


export const loadDatabase = async () => {
    
    let usersArr: IUserPayload[] = []
    for (i = 0; i < numUsers; i++){
        usersArr.push({
            firstName: randomString(),
            lastName: randomString(),
            email: `${randomString()}@${randomString(5)}.com`
        });
    }

    let userRes = await createUsers(usersArr);

    let transactionsArr: ITransactionPayload[] = []
    for (i = 0; i < numTransactions; i++){
        let sender = userRes[Math.floor(Math.random() * userRes.length)]
        let receiver = userRes.filter(user => user.id != sender.id)[Math.floor(Math.random() * (userRes.length - 1))]
        transactionsArr.push({
            sender:  sender,
            receiver: receiver,
            transactionDate: new Date(Date.now() - Math.round(Math.random() * 1209600 * 1000)),
            transactionAmount: Math.round(Math.random() * 1000),
            transactionStatus: (Math.floor(Math.random() * 4) as TransactionStatus)
        });
    }
    let transactionRes = await createTransactions(transactionsArr);

    if (userRes instanceof QueryFailedError){
        return userRes;
    }
    else if (transactionRes instanceof QueryFailedError){
        return transactionRes
    }
    else {
        return `Created ${numUsers} users and ${numTransactions} transactions!`;
    }
}