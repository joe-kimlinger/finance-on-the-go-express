import { QueryFailedError } from "typeorm";
import { AnalyticsSummary } from "../classes/analytics_summary";
import { UserRelationshipSummary } from "../classes/user_relationship_summary";
import { Transaction } from "../models";
import { getTransactions } from "../repositories/transaction.repository";

export default class AnalyticsController {
    public async getAnalytics(startDate: Date, endDate: Date, userId: number): Promise<AnalyticsSummary | Error> {

        let transactions = await getTransactions(startDate, endDate, userId)
        if (transactions instanceof QueryFailedError)
            return new Error(`There was an error querying transactions for user ${userId} between dates ${startDate} and ${endDate}.`)
        else if (transactions.length < 1)
            return new Error(`No transactions found for user ${userId} between dates ${startDate} and ${endDate}.`)
        else if (transactions instanceof Error)
            return new Error("An error occurred.")
        else 
            return this.computeAnalytics(transactions as Transaction[])
    }

    private computeAnalytics(transactions: Transaction[]): AnalyticsSummary | Error {
        let interactionMap = new Map<number, UserRelationshipSummary>();
        let analyticsSummary = new AnalyticsSummary();
        
        // Set the totals and fill in the interaction map
        for (let i: number = 0; i < transactions.length; i++){
            let totalSent = 0;
            let totalReceived = 0;
            let totalSaved = 0;

            if (transactions[i].action == 'send') {
                totalSent = transactions[i].amount;
            }
            else if (transactions[i].action == 'receive') {
                totalReceived = transactions[i].amount;
            }
            else if (transactions[i].action == 'save') {
                totalSaved = transactions[i].amount;
            }
            else {
                return new Error(`Unrecognized transaction type ${transactions[i].action}`);
            }

            analyticsSummary.totalSent += totalSent;
            analyticsSummary.totalReceived += totalReceived;
            analyticsSummary.totalSaved += totalSaved;
            analyticsSummary.totalTransacted += totalSent + totalReceived + totalSaved;

            let interaction: UserRelationshipSummary;
            if (interactionMap.has(transactions[i].sender.userId)){
                interaction = interactionMap.get(transactions[i].sender.userId);
            }
            else {
                interaction = new UserRelationshipSummary();
                interaction.user = transactions[i].sender;
            }
            interaction.sentTo += totalSent;
            interaction.receivedFrom += totalReceived;
            interaction.transactionCount++;
            interactionMap.set(transactions[i].sender.userId, interaction)
        }

        // Determine sponsor, sponsee, and best friends
        analyticsSummary.bestFriends = [];

        for (let [key, val] of interactionMap){
            if (!analyticsSummary.bestFriends.length){
                analyticsSummary.bestFriends.push(val);
            }
            else {
                let i: number = 0;
                while (i < analyticsSummary.bestFriends.length){
                    if (analyticsSummary.bestFriends[i].transactionCount < val.transactionCount){
                        analyticsSummary.bestFriends.splice(i, 0, val)
                        break;
                    }
                    i++;
                }
                // If we've gone all the way through without inserting an the list is still less than 3
                if (i == analyticsSummary.bestFriends.length && i < 3){
                    analyticsSummary.bestFriends.push(val)
                }
                // If we've inserted and now the list if 4 long
                if (analyticsSummary.bestFriends.length > 3){
                    analyticsSummary.bestFriends.pop()
                }
            }

            if (!analyticsSummary.sponsor || analyticsSummary.sponsor.receivedFrom < val.receivedFrom){
                analyticsSummary.sponsor = val;
            }
            if (!analyticsSummary.sponsee || analyticsSummary.sponsee.sentTo < val.sentTo){
                analyticsSummary.sponsee = val;
            } 
        }

        return analyticsSummary;
    }

}