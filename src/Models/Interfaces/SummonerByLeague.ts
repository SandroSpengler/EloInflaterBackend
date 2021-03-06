import { Document } from "mongoose";
import { SbLTier } from "../Types/SummonerByLeagueTypes";

export default interface SummonerByLeague extends Partial<Document> {
  tier: SbLTier;
  leagueId: string;
  queue: string;
  name: string;
  entries: EntriesByLeague[];
  createdAt?: number;
  updatedAt?: number;
}

export interface EntriesByLeague extends Partial<Document> {
  _id: string;
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
