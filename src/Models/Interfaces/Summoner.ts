import { Document } from "mongoose";

export default interface ISummonerSchema extends Partial<Document>, Summoner {}

export interface Summoner {
	summonerId: string;
	accountId: string;
	puuid: string;
	name: string;
	profileIconId?: number;
	revisionDate?: number;
	summonerLevel?: number;
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
	uninflatedMatchList: string[];
	inflatedMatchList: string[];
	exhaustCount: number;
	exhaustCastCount: number;
	tabisCount: number;
	zhonaysCount: number;
	zhonaysCastCount: number;
	lastRankUpdate?: number;
	lastMatchUpdate?: number;
	outstandingMatches?: number;
	createdAt?: number;
	updatedAt?: number;
}
