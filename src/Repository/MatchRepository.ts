import MatchData from "../Models/Interfaces/MatchData";

import MatchSchema from "../Models/Schemas/MatchSchema";
// import { getMatchesIdsBySummonerpuuid } from "../Services/Http";
// import { updateSummonerByPUUID } from "./SummonerRepository";

export class MatchRepository {
	constructor() {}

	findAllMachtes = async (): Promise<MatchData[] | null> => {
		let allMatches: MatchData[] | null;
		try {
			allMatches = await MatchSchema.find().lean();

			return allMatches;
		} catch (error) {}

		return null;
	};

	findMatchById = async (matchId: string): Promise<MatchData | null> => {
		let matchById: MatchData | null;
		try {
			matchById = await MatchSchema.findOne({ _id: matchId }).lean();

			return matchById;
		} catch (error) {
			return null;
		}
	};

	/**
	 * Find all Matches for the MatchIds inside the Summoner.MatchList
	 *
	 * @retuns List of MatchData for Summoner
	 */
	findMatchesByIdList = async (matchIdList: string[]): Promise<MatchData[] | null> => {
		let foundMatches: MatchData[] = [];
		try {
			if (!matchIdList || matchIdList.length === 0) return null;

			for (const matchId of matchIdList) {
				let matchById = await MatchSchema.findOne({ _id: matchId }).lean();

				if (matchById === null) continue;

				foundMatches.push(matchById);
			}

			return foundMatches;
		} catch (error) {
			return null;
		}
	};

	findAllMatchesBySummonerPUUID = async (summonerPUUID: string): Promise<MatchData[]> => {
		let matchesById: MatchData[];
		try {
			matchesById = await MatchSchema.find({ "info.participants.puuid": summonerPUUID }).lean();

			return matchesById;
		} catch (error) {
			throw error;
		}
	};

	findMatchesBySummonerPUUIDPaginated = async (
		summonerPUUID: string,
		skip: number = 0,
		take: number = 30,
	): Promise<MatchData[]> => {
		let matchesById: MatchData[];

		try {
			matchesById = await MatchSchema.find({ "info.participants.puuid": summonerPUUID })
				.skip(skip === 0 ? 0 : skip * take)
				.limit(take === 0 ? 30 : take)
				.lean()
				.sort({ "info.gameCreation": -1 });

			return matchesById;
		} catch (error) {
			throw error;
		}
	};

	createMatch = async (match: MatchData): Promise<MatchData | null> => {
		try {
			let tmpMatch = new MatchSchema();

			(tmpMatch._id as any) = match.metadata.matchId as any;
			tmpMatch.metadata = match.metadata;
			tmpMatch.info = match.info;

			await tmpMatch.save();
		} catch (error) {
			throw error;
		}

		return null;
	};

	createMultipleMatches = async (matchList: MatchData[]): Promise<MatchData | null> => {
		try {
			const mappedMatches: MatchData[] = [];

			matchList.forEach((match) => {
				let tmpMatch = new MatchSchema();

				(tmpMatch._id as any) = match.metadata.matchId as any;
				tmpMatch.metadata = match.metadata;
				tmpMatch.info = match.info;

				mappedMatches.push(tmpMatch);
			});

			await MatchSchema.insertMany(mappedMatches);
		} catch (error) {
			throw error;
		}

		return null;
	};

	updateMatch = async (match: MatchData): Promise<MatchData | null> => {
		let matchById: MatchData | null;
		try {
			await MatchSchema.updateOne({ _id: match._id }, match).exec();
		} catch (error) {
			throw error;
		}

		return null;
	};

	addMatchesForSummonerPUUID = async (match: MatchData) => {
		// Maybe
		// Check what matches are already in DB

		try {
		} catch (error) {
			throw error;
		}

		return null;
	};
}
