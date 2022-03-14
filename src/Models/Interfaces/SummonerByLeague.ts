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
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  rank: string;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
  createdAt?: number;
  updatedAt?: number;
}
