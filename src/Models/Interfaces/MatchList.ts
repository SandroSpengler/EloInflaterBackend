import { Document } from "mongoose";

export interface MatchList {}

export interface IMatchSchema extends Partial<Document> {
  matchId: string;
  exhaustAbused: boolean;
  tabisAbused: boolean;
}
