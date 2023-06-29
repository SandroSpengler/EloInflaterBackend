import { rankQueue, rankTier } from "../Types/ApiTypes";
import { SbLQueue, SbLTier } from "../Types/SummonerByLeagueTypes";

export default interface SummonerRankInfo {
	leagueId: string;
	queueType: rankQueue;
	tier: rankTier;
	rank: string;
	summonerId: string;
	summonerName: string;
	leaguePoints: number;
	wins: number;
	losses: number;
	veteran: boolean;
	inactive: boolean;
	freshBlood: boolean;
	hotStreak: boolean;
}
