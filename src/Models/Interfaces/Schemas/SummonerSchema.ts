import * as mongoose from "mongoose";
import { Schema, Document, Model } from "mongoose";
import { Summoner } from "../Summoner";

const SummonerSchema: Schema = new Schema({
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
});

export default mongoose.model<Summoner>("SummonerSchema", SummonerSchema);
