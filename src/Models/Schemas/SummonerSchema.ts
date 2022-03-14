import * as mongoose from "mongoose";
import { Schema, Document, model } from "mongoose";
import Summoner from "../Interfaces/Summoner";

const MatchSchema: Schema = new Schema(
  {
    matchId: {
      type: String,
    },
    exhaustAbused: {
      type: Boolean,
    },
    tabisAbused: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const SummonerSchema: Schema = new Schema(
  {
    _id: { type: String },
    id: {
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
      type: [MatchSchema],
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

export default mongoose.model<Summoner>("SummonerSchema", SummonerSchema);
