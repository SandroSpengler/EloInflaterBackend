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
			required: true,
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
			required: true,
		},
		profileIconId: {
			type: Number,
			default: 0,
		},
		revisionDate: {
			type: Number,
			default: 0,
		},
		summonerLevel: {
			type: Number,
			default: 0,
		},
		leaguePoints: {
			type: Number,
			default: 0,
		},
		rank: {
			type: String,
			default: "",
		},
		rankSolo: {
			type: String,
			default: "",
		},
		flexSolo: {
			type: String,
			default: "",
		},
		flextt: {
			type: String,
			default: "",
		},
		wins: {
			type: Number,
			default: 0,
		},
		losses: {
			type: Number,
			default: 0,
		},
		veteran: {
			type: Boolean,
			default: false,
		},
		inactive: {
			type: Boolean,
			default: false,
		},
		freshBlood: {
			type: Boolean,
			default: false,
		},
		hotStreak: {
			type: Boolean,
			default: false,
		},
		inflatedMatchList: {
			type: [String],
			default: [],
		},
		uninflatedMatchList: {
			type: [String],
			default: [],
		},
		exhaustCount: {
			type: Number,
			default: 0,
		},
		exhaustCastCount: {
			type: Number,
			default: 0,
		},
		tabisCount: {
			type: Number,
			default: 0,
		},
		zhonaysCount: {
			type: Number,
			default: 0,
		},
		zhonaysCastCount: {
			type: Number,
			default: 0,
		},
		lastRankUpdate: {
			type: Number,
		},
		lastMatchUpdate: {
			type: Number,
		},
		outstandingMatches: {
			type: Number,
			default: 0,
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
	},
);

SummonerSchema.index({ puuid: 1 });
SummonerSchema.index({ rankSolo: 1 });

//#endregion

export default mongoose.model<Summoner>("SummonerSchema", SummonerSchema);
