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
  matchList: IMatchSchema[];
  createdAt?: number;
  updatedAt?: number;
}
