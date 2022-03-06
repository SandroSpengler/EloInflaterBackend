import { Document } from "mongoose";

export default interface Summoner extends Partial<Document> {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  createdAt?: number;
  updatedAt?: number;
}
