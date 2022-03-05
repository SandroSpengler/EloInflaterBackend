import * as mongoose from "mongoose";
import { Schema, Document, model } from "mongoose";
import Summoner from "../Interfaces/Summoner";

const SummonerSchema: Schema = new Schema(
  {
    id: {
      type: "String",
    },
    accountId: {
      type: "String",
    },
    puuid: {
      type: "String",
    },
    name: {
      type: "String",
    },
    profileIconId: {
      type: "Number",
    },
    revisionDate: {
      type: "Number",
    },
    summonerLevel: {
      type: "Number",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Summoner>("SummonerSchema", SummonerSchema);
