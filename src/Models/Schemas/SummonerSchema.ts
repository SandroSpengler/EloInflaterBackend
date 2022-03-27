import * as mongoose from "mongoose";
import { Schema, Document, model } from "mongoose";
import Summoner from "../Interfaces/Summoner";
import MatchSchema from "./MatchSchema";

//#region Summoner
const SummonerSchema: Schema = new Schema(
  {
    _id: { type: String },
    id: {
      type: String,
    },
    summonerId: {
      type: String,
    },
    accountId: {
      type: String,
    },
    puuid: {
      type: String,
    },
    name: {
      type: String,
    },
    profileIconId: {
      type: Number,
    },
    revisionDate: {
      type: Number,
    },
    summonerLevel: {
      type: Number,
    },
    leaguePoints: {
      type: Number,
    },
    rank: {
      type: String,
    },
    rankSolo: {
      type: String,
    },
    flexSolo: {
      type: String,
    },
    flextt: {
      type: String,
    },
    wins: {
      type: Number,
    },
    losses: {
      type: Number,
    },
    veteran: {
      type: Boolean,
    },
    inactive: {
      type: Boolean,
    },
    freshBlood: {
      type: Boolean,
    },
    hotStreak: {
      type: Boolean,
    },
    matchList: {
      type: [String],
      default: [],
    },
    exhaustCount: {
      type: Number,
    },
    exhaustCastCount: {
      type: Number,
    },
    tabisCount: {
      type: Number,
    },
    zhonaysCount: {
      type: Number,
    },
    zhonaysCastCount: {
      type: Number,
    },
    lastRankUpdate: {
      type: Number,
    },
    lastMatchUpdate: {
      type: Number,
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

//#endregion

export default mongoose.model<Summoner>("SummonerSchema", SummonerSchema);
