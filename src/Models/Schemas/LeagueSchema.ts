import * as mongoose from "mongoose";
import { Schema, Document, model } from "mongoose";
import SummonerByLeague from "../Interfaces/SummonerByLeague";

const EntriesSchema: Schema = new Schema(
  {
    summonerId: {
      type: String,
    },
    summonerName: {
      type: String,
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

const SummonerByLeagueSchema: Schema = new Schema(
  {
    tier: {
      type: String,
    },
    leagueId: {
      type: String,
    },
    queue: {
      type: String,
    },
    name: {
      type: String,
    },
    entries: {
      type: [EntriesSchema],
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

export default mongoose.model<SummonerByLeague>("SummonerByLeagueSchema", SummonerByLeagueSchema);
