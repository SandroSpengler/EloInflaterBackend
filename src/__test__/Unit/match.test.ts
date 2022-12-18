import Summoner from "../../Models/Interfaces/Summoner";

import { MatchRepository } from "../../Repository/MatchRepository";
import { SummonerRepository } from "../../Repository/SummonerRepository";

import { MatchService } from "../../Services/MatchService";
import { RiotGamesHttp } from "../../Services/HttpService";
import { DataMiningService } from "../../Services/DataMiningService";

describe("Match", () => {
	let summonerMock: Summoner;

	let RGHttp: RiotGamesHttp;

	let matchRepo: MatchRepository;
	let matchService: MatchService;

	let summonerRepo: SummonerRepository;
	let dataMiningService: DataMiningService;

	beforeAll(async () => {
		RGHttp = new RiotGamesHttp();

		matchRepo = new MatchRepository();
		matchService = new MatchService(matchRepo, RGHttp);

		summonerRepo = new SummonerRepository();

		dataMiningService = new DataMiningService(summonerRepo, RGHttp, matchRepo, matchService);

		summonerMock = require("../../__mock__/Data/Summoner.json");
	});

	describe("Functions", () => {
		it.skip("Function => All Matches in DB in SummonerMatchList", async () => {
			const summonerInDB = await summonerRepo.findSummonerByPUUID(summonerMock.puuid);

			if (summonerInDB === null) throw new Error("Function => Summoner does not exist in DB");

			try {
				await dataMiningService.addUnassignedMatchesToSummoner(summonerInDB);

				const matchesInDBForSummoner = await matchRepo.findAllMatchesBySummonerPUUID(
					summonerInDB.puuid,
				);

				const summonerInDBUpdated = await summonerRepo.findSummonerByPUUID(summonerMock.puuid);

				if (summonerInDBUpdated === null) throw new Error();

				expect(
					summonerInDB.uninflatedMatchList.length + summonerInDB.inflatedMatchList.length,
				).toEqual(matchesInDBForSummoner.length);
			} catch (error) {
				throw error;
			}
		});

		it.skip("Function => Add/Update recent Matches for Summoner", async () => {
			// Update Summoner Matches
			/// GET Matches for User eg 73
			// in DB are 73
			// Call update MatchesForUser

			const summonerBeforeUpdate = await summonerRepo.findSummonerByPUUID(summonerMock.puuid);

			if (summonerBeforeUpdate === null) throw new Error("Mock Summoner not found in DB");

			const summonerMatches = await matchRepo.findAllMatchesBySummonerPUUID(summonerMock.puuid);

			expect(
				summonerBeforeUpdate.uninflatedMatchList.length +
					summonerBeforeUpdate.inflatedMatchList.length,
			).toEqual(summonerMatches.length);

			try {
				await dataMiningService.addNewMatchesToSummoner(summonerBeforeUpdate);
			} catch (error) {
				// console.log(error);
				throw error;
			}
		});
	});
});
