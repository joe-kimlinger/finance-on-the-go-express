import { QueryFailedError, TableUnique } from "typeorm";
import { AnalyticsSummary } from "../classes/analytics_summary";
import { UserRelationshipSummary } from "../classes/user_relationship_summary";
import { Transaction, User } from "../models";
import {
    getTransactions,
} from "../repositories/transaction.repository";

export default class AnalyticsController {
    public async getAnalytics(startDate: Date, endDate: Date, userId: number): Promise<AnalyticsSummary | Error> {

        let transactions = await getTransactions(startDate, endDate, userId)
        if (transactions instanceof QueryFailedError)
            return new Error(`There was an error querying transactions for user ${userId} between dates ${startDate} and ${endDate}.`)
        else if (transactions.length < 1)
            return new Error(`No transactions found for user ${userId} between dates ${startDate} and ${endDate}.`)
        else 
            return this.computeAnalytics(transactions as Transaction[], userId)
    }

    private computeAnalytics(transactions: Transaction[], userId: number): AnalyticsSummary {
        let interactionMap = new Map<number, UserRelationshipSummary>();
        let analyticsSummary = new AnalyticsSummary();
        
        // Set the totals and fill in the interaction map
        for (let i: number = 0; i < transactions.length; i++){
            let totalSent = 0;
            let totalReceived = 0;
            let otherUser: User;
            if (transactions[i].sender.id == userId) {
                otherUser = transactions[i].receiver;
                totalSent = transactions[i].transactionAmount;
            }
            else {
                otherUser = transactions[i].sender;
                totalReceived = transactions[i].transactionAmount;
            }

            analyticsSummary.totalSent += totalSent;
            analyticsSummary.totalReceived += totalReceived;
            analyticsSummary.totalTransacted += totalSent + totalReceived;

            let interaction: UserRelationshipSummary;
            if (interactionMap.has(otherUser.id)){
                interaction = interactionMap.get(otherUser.id);
            }
            else {
                interaction = new UserRelationshipSummary();
                interaction.user = otherUser;
            }
            interaction.sentTo += totalSent;
            interaction.receivedFrom += totalReceived;
            interaction.transactionCount++;
            interactionMap.set(otherUser.id, interaction)
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