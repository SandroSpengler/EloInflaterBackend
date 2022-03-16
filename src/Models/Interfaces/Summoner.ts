import { Document } from "mongoose";
import { IMatchSchema, MatchList } from "./MatchList";

export default interface Summoner extends Partial<Document> {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  leaguePoints?: number;
  rank?: string;
  rankSolo?: string;
  flexSolo?: string;
  flextt?: string;
  wins?: number;
  losses?: number;
  veteran?: boolean;
  inactive?: boolean;
  freshBlood?: boolean;
  hotStreak?: boolean;
  matchList: IMatchSchema[];
  createdAt?: number;
  updatedAt?: number;
}
