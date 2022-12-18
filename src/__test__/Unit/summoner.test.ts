// import {describe, expect, it, afterEach, beforeEach, beforeAll} from "@jest/globals";
// import jest from "jest";
// import "jest";

import Summoner from "../../Models/Interfaces/Summoner";

import { RiotGamesHttp } from "../../Services/HttpService";
import { SummonerByLeagueService } from "../../Services/SummonerByLeagueService";
import { SummonerService } from "../../Services/SummonerService";

import { SummonerByLeagueRepository } from "../../Repository/SummonerByLeagueRepository";
import { SummonerRepository } from "../../Repository/SummonerRepository";

import { mockFindSummonerByLeague } from "../../__mock__/Logic/SbLRepo";
import {
	mockCreateSummoner,
	mockFindAllSummonerByRank,
	mockFindSummonerBySummonerID,
	mockUpdateSummonerBySummonerID,
} from "../../__mock__/Logic/SummonerRepo";

describe("Summoner", () => {
	let summonerMock: Summoner;
	let summonerByRankMock: Summoner[];

	let summonerRepo: SummonerRepository;
	let summonerService: SummonerService;

	let SbLRepo: SummonerByLeagueRepository;
	let SbLService: SummonerByLeagueService;

	let RGHttp: RiotGamesHttp;

	let summonerRepoMock;
	let SbLRepoMock;

	let summonerServiceMock;

	beforeAll(() => {
		summonerMock = require("../../__mock__/Data/Summoner.json");
		summonerByRankMock = require("../../__mock__/Data/SbRChallenger.json");

		RGHttp = new RiotGamesHttp();

		summonerRepo = new SummonerRepository();
		summonerService = new SummonerService(summonerRepo, RGHttp);

		SbLRepo = new SummonerByLeagueRepository();
		SbLService = new SummonerByLeagueService(SbLRepo, summonerRepo, RGHttp);

		// ToDo - Add Typescript typings
		summonerRepoMock = jest.mock("../../Repository/SummonerRepository");
		SbLRepoMock = jest.mock("../../Repository/SummonerByLeagueRepository");

		summonerServiceMock = jest.mock("../../Repository/SummonerByLeagueRepository");
	});

	describe("Summoner Function Tests", () => {
		beforeEach(() => {
			// Mock Repository for Database Functions
			summonerRepoMock.findAllSummonersByRank = mockFindAllSummonerByRank;
			summonerRepoMock.updateSummonerBySummonerID = mockUpdateSummonerBySummonerID;
			summonerRepoMock.findSummonerByID = mockFindSummonerBySummonerID;
			summonerRepoMock.createSummoner = mockCreateSummoner;

			// Inject SummonerRepoMock into SummonerService
			summonerService = new SummonerService(summonerRepoMock, RGHttp);
		});

		afterEach(() => {
			mockFindAllSummonerByRank.mockClear();
			mockUpdateSummonerBySummonerID.mockClear();
			mockFindSummonerBySummonerID.mockClear();
			mockCreateSummoner.mockClear();
			mockFindSummonerByLeague.mockClear();
		});

		it.skip("Function => checkIfSummonerCanBeUpdated", () => {
			let currentDate = new Date().getTime();

			expect(summonerMock?.updatedAt!).toBeLessThan(currentDate);

			expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(true);

			summonerMock.updatedAt = currentDate;

			expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(false);

			// now - 10 Hours
			summonerMock.updatedAt = new Date().getTime() - 10 * 60 * 60 * 1000;

			expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(true);
		});

		it.skip("Function => update Summoner by SbLCollection - CHALLENGER", async () => {
			const SblDbMock = mockFindSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

			if (SblDbMock === null) throw new Error("SummonerByLeague not found in MockData");

			expect(mockFindSummonerByLeague.mock.calls.length).toEqual(1);

			await summonerService.updateSumonersByLeague(SblDbMock);

			expect(mockUpdateSummonerBySummonerID.mock.calls.length).toEqual(332);

			expect(mockFindSummonerBySummonerID.mock.calls.length).toEqual(300);

			expect(mockCreateSummoner.mock.calls.length).toEqual(17);
		});

		it.skip("Function => update Summoner by SbLCollection - GRANDMASTER", async () => {
			const SblDbMock = mockFindSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

			if (SblDbMock === null) throw new Error("SummonerByLeague not found in MockData");

			expect(mockFindSummonerByLeague.mock.calls.length).toEqual(1);

			await summonerService.updateSumonersByLeague(SblDbMock);

			expect(mockUpdateSummonerBySummonerID.mock.calls.length).toEqual(729);

			expect(mockFindSummonerBySummonerID.mock.calls.length).toEqual(700);

			expect(mockCreateSummoner.mock.calls.length).toEqual(115);
		});

		// Too large to execute everytime
		it.skip("Function => update Summoner by SbLCollection - MASTER", async () => {
			const SblDbMock = mockFindSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

			if (SblDbMock === null) throw new Error("SummonerByLeague not found in MockData");

			expect(mockFindSummonerByLeague.mock.calls.length).toEqual(1);

			await summonerService.updateSumonersByLeague(SblDbMock);

			expect(mockUpdateSummonerBySummonerID.mock.calls.length).toEqual(3874);

			expect(mockFindSummonerBySummonerID.mock.calls.length).toEqual(3308);

			expect(mockCreateSummoner.mock.calls.length).toEqual(2114);
		});

		// ToDo - Implementation
		// it.skip("Function => validate SummonerInformation by SummonerId", async () => {
		//   try {
		//     await summonerService.validateSummonerById(undefined as any);
		//   } catch (error: any) {
		//     expect(error.message).toContain("No SummonerId provided");
		//   }

		//   try {
		//     // Need to mock DB here
		//     await summonerService.validateSummonerById(summonerMock.summonerId);
		//   } catch (error) {
		//     console.log(error);
		//   }
		// });
	});
});
