import { User } from "../models";

export class UserRelationshipSummary {
    transactionCount: number = 0;
    user: User;
    sentTo: number = 0;
    receivedFrom: number = 0;
}