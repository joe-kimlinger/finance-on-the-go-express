import { User } from "../models";
import { UserRelationshipSummary } from "./user_relationship_summary";

export class AnalyticsSummary {
    user: User;
    totalSent: number = 0;
    totalReceived: number = 0;
    totalSaved: number = 0;
    totalTransacted: number = 0;
    sponsee: UserRelationshipSummary;
    sponsor: UserRelationshipSummary;
    bestFriends: UserRelationshipSummary[];
}