import Summoner from "../Models/Interfaces/Summoner";
import SummonerByLeague from "../Models/Interfaces/SummonerByLeague";

import { SummonerRepository } from "../Repository/SummonerRepository";

import { RiotGamesHttp } from "./HttpService";

export class SummonerService {
	private summonerRepo: SummonerRepository;

	private RGHttp: RiotGamesHttp;

	constructor(summonerRepo: SummonerRepository, RGHttp: RiotGamesHttp) {
		this.summonerRepo = summonerRepo;
		this.RGHttp = RGHttp;
	}

	/**
	 * Checks if summonerMatches can be updated
	 *
	 * @param summoner Summoner that should be checked for updateability
	 *
	 * @returns Boolean which states if summoner update is possible
	 */
	checkIfSummonerCanBeUpdated = (summoner: Summoner): Boolean => {
		// 2 Hours
		let unixTimeStamp = new Date().getTime() - 2 * 60 * 1000;

		if (summoner.updatedAt === undefined) return true;

		if (summoner.updatedAt < unixTimeStamp) return true;

		return false;
	};

	/**
	 * Checks if summonerMatches can be updated
	 *
	 * @param summoner Summoner that should be checked for updateability
	 *
	 * @returns Boolean which states if summoner update is possible
	 */
	checkIfSummonerMatchesCanBeUpdated = (summoner: Summoner): Boolean => {
		// 2 Hours
		let unixTimeStamp = new Date().getTime() - 12 * 60 * 60 * 1000;

		if (summoner.lastMatchUpdate === undefined) return true;

		if (summoner.lastMatchUpdate < unixTimeStamp) return true;

		return false;
	};

	/**
	 * Not yet tested
	 * Update Summoner information in DB
	 *
	 *
	 * @param summonerId Id of the Summoner
	 * @returns
	 */
	validateSummonerById = async (summonerId: string) => {
		if (!summonerId) throw new Error("No SummonerId provided");

		try {
			const summonerInDB = await this.summonerRepo.findSummonerByID(summonerId);

			const RGsummoner = (await this.RGHttp.getSummonerBySummonerId(summonerId)).data;

			if (summonerInDB === null) {
				await this.summonerRepo.createSummoner(RGsummoner);

				return;
			} else {
				summonerInDB.id = RGsummoner.id;
				summonerInDB.puuid = RGsummoner.puuid;
				summonerInDB.accountId = RGsummoner.accountId;
				summonerInDB.name = RGsummoner.name;
				summonerInDB.profileIconId = RGsummoner.profileIconId;
				summonerInDB.revisionDate = RGsummoner.revisionDate;
				summonerInDB.summonerLevel = RGsummoner.summonerLevel;

				await this.summonerRepo.updateSummonerBySummonerID(summonerInDB);
			}
		} catch (error) {
			throw error;
		}
	};

	/**
	 * Updates/Creates all Summoners in DB based SbLCollection
	 *
	 * @param SbLInDB
	 */
	updateSumonersByLeague = async (SbLInDB: SummonerByLeague) => {
		// 1. Find all Summoners in DB based on SbLInDB.tier
		// 1.1 Check if SummonersInDB are still part of SbLInDB
		// 1.2 Update all SummonersInDB with current information from SbLInDB

		const summonersByRankSolo = await this.summonerRepo.findAllSummonersByRank(SbLInDB.tier);

		let outDatedSummoners: Summoner[] = [];

		if (summonersByRankSolo.length === 0) {
			throw new Error(`No Summoners found with rankSolo equal to ${SbLInDB.tier}`);
		}

		// All Summoners that are not CHALLENGER but rankSolo is CHALLENGER
		outDatedSummoners = summonersByRankSolo.filter((summoner) => {
			return !SbLInDB.entries.some((SbLSummoner) => summoner._id === SbLSummoner.summonerId);
		});

		// Reset rank for outdated ones

		for (let summoner of outDatedSummoners) {
			summoner.rankSolo = "";

			this.summonerRepo.updateSummonerBySummonerID(summoner);
		}

		// create or update current ones
		for (let summonerSbL of SbLInDB.entries) {
			let summoner = await this.summonerRepo.findSummonerByID(summonerSbL.summonerId);

			// create new summoner
			if (!summoner) {
				let summonerToSave: Summoner = {
					_id: summonerSbL.summonerId,
					id: summonerSbL.summonerId,
					summonerId: summonerSbL.summonerId,
					accountId: "",
					puuid: "",
					name: summonerSbL.summonerName,
					profileIconId: 0,
					revisionDate: 0,
					summonerLevel: 0,
					leaguePoints: summonerSbL.leaguePoints,
					rank: summonerSbL.rank,
					rankSolo: SbLInDB.tier,
					wins: summonerSbL.wins,
					losses: summonerSbL.losses,
					veteran: summonerSbL.veteran,
					inactive: summonerSbL.inactive,
					inflatedMatchList: [],
					uninflatedMatchList: [],
					freshBlood: summonerSbL.freshBlood,
					hotStreak: summonerSbL.hotStreak,
					updatedAt: SbLInDB.updatedAt,
					exhaustCount: 0,
					exhaustCastCount: 0,
					tabisCount: 0,
					zhonaysCount: 0,
					zhonaysCastCount: 0,
				};

				// Todo Add Flex and TT
				if (SbLInDB?.queue === "RANKED_SOLO_5x5") {
					summonerToSave.rankSolo = SbLInDB.tier;
				}

				try {
					await this.summonerRepo.createSummoner(summonerToSave);
				} catch (error) {
					console.log(error);
				}
			}

			if (summoner) {
				summoner.name = summonerSbL.summonerName;
				summoner.leaguePoints = summonerSbL.leaguePoints;
				summoner.rank = summonerSbL.rank;
				summoner.rankSolo = SbLInDB.tier;
				summoner.wins = summonerSbL.wins;
				summoner.losses = summonerSbL.losses;
				summoner.veteran = summonerSbL.veteran;
				summoner.inactive = summonerSbL.inactive;
				summoner.freshBlood = summonerSbL.freshBlood;
				summoner.hotStreak = summonerSbL.hotStreak;

				// Todo Add Flex and TT
				if (SbLInDB?.queue === "RANKED_SOLO_5x5") {
					summoner.rankSolo = SbLInDB.tier;
				}

				await this.summonerRepo.updateSummonerBySummonerID(summoner);
			}
		}
	};
}
