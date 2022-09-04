import { Document } from "mongoose";
import { MatchData } from "./MatchData";
import { IMatchSchema, MatchList } from "./MatchList";

/**
 * @openapi
 * components:
 *  schemas:
 *   Summoner:
 *     type: object
 *     properties:
 *      id:
 *        type: string
 *      summonerId:
 *        type: string
 *      accountId:
 *        type: string
 *      puuid:
 *        type: string
 *      name:
 *        type: string
 *      profileIconId:
 *        type: integer
 *      revisionDate:
 *        type: integer
 *      summonerLevel:
 *        type: integer
 *      leaguePoints:
 *        type: integer
 *      rank:
 *        type: string
 *      wins:
 *        type: integer
 *      losses:
 *        type: integer
 *      rankSolo:
 *        type: string
 *      veteran:
 *        type: boolean
 *      inactive:
 *        type: boolean
 *      freshBlood:
 *        type: boolean
 *      hotStreak:
 *        type: boolean
 *      uninflatedMatchList:
 *        type: array
 *        items:
 *          type: string
 *      inflatedMatchList:
 *        type: array
 *        items:
 *          type: string
 *      exhaustCount:
 *        type: integer
 *      exhaustCastCount:
 *        type: integer
 *      zhonaysCount:
 *        type: integer
 *      zhonaysCastCount:
 *        type: integer
 *      tabisCount:
 *        type: integer
 *      updatedAt:
 *        type: integer
 *      lastMatchUpdate:
 *        type: integer
 */
export default interface Summoner extends Partial<Document> {
  id: string;
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
  createdAt?: number;
  updatedAt?: number;
}
