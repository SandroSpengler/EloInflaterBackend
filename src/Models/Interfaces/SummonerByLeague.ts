import { Document } from "mongoose";

export default interface SummonerByLeague extends Partial<Document> {
  tier: string;
  leagueId: string;
  queue: string;
  name: string;
  entries: EntriesByLeague[];
  createdAt?: number;
  updatedAt?: number;
}

export interface EntriesByLeague extends Partial<Document> {
  summonerId: String;
  summonerName: String;
  leaguePoints: Number;
  rank: String;
  wins: Number;
  losses: Number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
  createdAt?: number;
  updatedAt?: number;
}
