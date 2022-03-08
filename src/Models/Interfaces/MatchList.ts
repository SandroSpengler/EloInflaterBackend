import { Document } from "mongoose";

export interface MatchList {}

export interface IMatchSchema extends Partial<Document> {
  matchId: String;
  exhaustAbused: boolean;
  tabisAbused: boolean;
}
