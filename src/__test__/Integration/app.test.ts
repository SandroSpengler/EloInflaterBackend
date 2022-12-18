import request from "supertest";

import startApp from "../../app";

import Summoner from "../../Models/Interfaces/Summoner";

import { mockFindSummonerBySummonerName } from "../../__mock__/Logic/SummonerRepo";
import { RiotGamesHttp } from "../../Services/HttpService";
import { Application } from "express";
import { SummonerController } from "../../Controller/Api/Data/SummonerController";

describe("Server startup", () => {
	let startedApp: Application;
	let summonerRepoMock;
	let summonerService;
	let summonerController: SummonerController;
	// Need to mock this one too
	let RGHttp;

	beforeAll(async () => {
		startedApp = await startApp();

		summonerRepoMock = jest.mock("../../Repository/SummonerRepository");
		summonerService = new summonerService(summonerRepoMock);

		summonerController = new SummonerController();
		summonerController.summonerService = summonerService;
	});

	beforeEach(async () => {
		summonerRepoMock.findSummonerByName = mockFindSummonerBySummonerName;
	});

	it.skip("Default Endpoint should return 200", async () => {
		const response = await request(startedApp).get("/");

		expect(response.statusCode).toEqual(200);
	});

	//#region Summoner Tests
	describe("SummonerController CRUD Operation", () => {
		it.skip("Get SummonerByName", async () => {
			const summoner = await summonerController.getSummonerByName("Alligator Casper");

			console.log(summoner);
		});

		// it.skip("Expect all Summoners with rankSolo - CHALLENGER", async () => {
		// 	expect(response.statusCode === 200);

		// 	const summonersByRankSolo: Summoner[] = response.body.result;

		// 	expect(summonersByRankSolo.length).toEqual(300);

		// 	expect(summonersByRankSolo).toEqual(
		// 		expect.arrayContaining([
		// 			expect.objectContaining({
		// 				name: expect.any(String),
		// 				_id: expect.any(String),
		// 				// matchList: expect.arrayContaining([expect.any(String)]),
		// 			}),
		// 		]),
		// 	);
		// });

		it.skip("Expect all Summoners with rankSolo - GRANDMASTER", async () => {
			const response = await request(startApp).get("/api/data/league/grandmaster/rankedsolo");

			expect(response.statusCode === 200);

			const summonersByRankSolo: Summoner[] = response.body.result;

			expect(summonersByRankSolo.length).toEqual(700);

			expect(summonersByRankSolo).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: expect.any(String),
						_id: expect.any(String),
						// matchList: expect.arrayContaining([expect.any(String)]),
					}),
				]),
			);
		});

		it.skip("Expect all Summoners with rankSolo - MASTER", async () => {
			const response = await request(startApp).get("/api/data/league/master/rankedsolo");

			expect(response.statusCode === 200);

			const summonersByRankSolo: Summoner[] = response.body.result;

			expect(summonersByRankSolo.length).toBeGreaterThan(3000);

			expect(summonersByRankSolo).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: expect.any(String),
						_id: expect.any(String),
						// matchList: expect.arrayContaining([expect.any(String)]),
					}),
				]),
			);
		});
	});
});
//#endregion
