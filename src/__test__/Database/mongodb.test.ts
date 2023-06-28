import { connectToMongoDB } from "../../MongoDB/mongodb";
import { MatchData } from "../../Models/Interfaces/MatchData";
import Summoner from "../../Models/Interfaces/Summoner";
import SummonerByLeague from "../../Models/Interfaces/SummonerByLeague";
import { SbLTier } from "../../Models/Types/SummonerByLeagueTypes";
import { MatchRepository } from "../../Repository/MatchRepository";
import { SummonerByLeagueRepository } from "../../Repository/SummonerByLeagueRepository";
import { SummonerRepository } from "../../Repository/SummonerRepository";
import { DataMiningService } from "../../Services/DataMiningService";
import { RiotGamesHttp } from "../../Services/HttpService";
import { MatchService } from "../../Services/MatchService";
import { SummonerByLeagueService } from "../../Services/SummonerByLeagueService";

describe("Match", () => {
	let summonerMock: Summoner;

	let RGHttp: RiotGamesHttp;

	let matchRepo: MatchRepository;
	let matchService: MatchService;

	let summonerRepo: SummonerRepository;
	let dataMiningService: DataMiningService;

	let SbLRepo: SummonerByLeagueRepository;
	let SbLService: SummonerByLeagueService;

	beforeAll(async () => {
		RGHttp = new RiotGamesHttp();

		matchRepo = new MatchRepository();
		matchService = new MatchService(matchRepo, RGHttp);

		summonerRepo = new SummonerRepository();

		dataMiningService = new DataMiningService(summonerRepo, RGHttp, matchRepo, matchService);

		SbLService = new SummonerByLeagueService(SbLRepo, summonerRepo, RGHttp);

		summonerMock = require("../TestSampleData/MockSummoner.json");

		await connectToMongoDB(process.env.DB_CONNECTION);
	});

	describe("MongoDB Queries ", () => {
		// 2022/10/04 - Check after indexes are built
		it.skip("DB => Expect matches for a Summoner by SummonerPUUID", async () => {
			const matchesForSummonerByPUUID: MatchData[] | null =
				await matchRepo.findAllMatchesBySummonerPUUID(summonerMock.puuid);

			if (matchesForSummonerByPUUID === null) throw new Error();

			expect(matchesForSummonerByPUUID.length).toBeGreaterThan(10);
		});

		it.skip("DB => Expect to find match by MatchID", async () => {
			const matchIdsToFind: string[] = [
				"EUW1_5786731345",
				"EUW1_5786607943",
				"EUW1_5786546394",
				"EUW1_5786459767",
				"EUW1_5786454535",
				"EUW1_5785186106",
				"EUW1_5785241272",
				"EUW1_5785160665",
				"EUW1_5785134056",
				"EUW1_5785049659",
				"EUW1_5785016404",
				"EUW1_5784879772",
				"EUW1_5784842982",
				"EUW1_5784744571",
				"EUW1_5784687907",
				"EUW1_5778937868",
				"EUW1_5778912817",
				"EUW1_5778806726",
			];

			for (let [index, matchId] of matchIdsToFind.entries()) {
				const foundMatch: MatchData | null = await matchRepo.findMatchById(matchId);

				if (foundMatch === null) throw new Error();

				expect(foundMatch.summonerId).toBe(matchIdsToFind[index]);
			}
		});

		it.skip("DB => Expect all matches in DB for MatchList", async () => {
			const matchList: string[] = [
				"EUW1_5786731345",
				"EUW1_5786607943",
				"EUW1_5786546394",
				"EUW1_5786459767",
				"EUW1_5786454535",
				"EUW1_5785186106",
				"EUW1_5785241272",
				"EUW1_5785160665",
				"EUW1_5785134056",
				"EUW1_5785049659",
				"EUW1_5785016404",
				"EUW1_5784879772",
				"EUW1_5784842982",
				"EUW1_5784744571",
				"EUW1_5784687907",
				"EUW1_5778937868",
				"EUW1_5778912817",
				"EUW1_5778806726",
			];

			const matchesInDB = await matchRepo.findMatchesByIdList(matchList);

			if (matchesInDB === null) throw new Error();

			for (let match of matchesInDB) {
				expect(matchList).toContain(match._id);
			}
		});
	});

	it.skip("DB => Expect to find Summoner By Name", async () => {
		// still case sensitive
		const summonerName: string = "test summoner";

		const summoner: Summoner | null = await summonerRepo.findSummonerByName(summonerName);

		expect(summoner).not.toBeNull();

		expect(summoner).toEqual(
			expect.objectContaining({
				_id: expect.anything(),
				name: summonerName,
				uninflatedMatchList: expect.arrayContaining([expect.any(String)]),
				puuid: expect.any(String),
				tabisCount: expect.any(Number),
				summonerLevel: expect.any(Number),
			}),
		);
	});

	it.skip("DB => Expect to find Summoner By PUUID", async () => {
		const summonerPUUID: string = "puuIdForTestSummoner";
		const summonerName = "test summoner";

		const summoner: Summoner | null = await summonerRepo.findSummonerByPUUID(summonerPUUID);

		expect(summoner).not.toBeNull();

		expect(summoner).toEqual(
			expect.objectContaining({
				_id: expect.anything(),
				puuid: summonerPUUID,
				name: summonerName,
				uninflatedMatchList: expect.arrayContaining([expect.any(String)]),
				tabisCount: expect.any(Number),
				summonerLevel: expect.any(Number),
			}),
		);
	});

	it.skip("DB => Expect to find Summoner By ID", async () => {
		const summonerId: string = "idForTestSummoner";
		const summonerName = "test summoner";

		const summoner: Summoner | null = await summonerRepo.findSummonerByID(summonerId);

		expect(summoner).not.toBeNull();

		expect(summoner).toEqual(
			expect.objectContaining({
				_id: summonerId,
				name: summonerName,
				uninflatedMatchList: expect.arrayContaining([expect.any(String)]),
				tabisCount: expect.any(Number),
				summonerLevel: expect.any(Number),
			}),
		);
	});

	it.skip("DB => Expect to find all Summoners by Rank - CHALLENGER", async () => {
		const rankSolo: SbLTier = "CHALLENGER";
		const summonersByRank: Summoner[] | null = await summonerRepo.findAllSummonersByRank(rankSolo);

		expect(summonersByRank).not.toBeNull();
		expect(summonersByRank?.length!).toBeGreaterThan(0);

		expect(summonersByRank).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					rankSolo: rankSolo,
					name: expect.any(String),
					wins: expect.any(Number),
					veteran: expect.any(Boolean),
				}),
			]),
		);
	});

	it.skip("DB => Expect to find all Summoners by Rank - GRANDMASTER", async () => {
		const rankSolo: SbLTier = "GRANDMASTER";
		const summonersByRank: Summoner[] | null = await summonerRepo.findAllSummonersByRank(rankSolo);

		expect(summonersByRank).not.toBeNull();
		expect(summonersByRank?.length!).toBeGreaterThan(0);

		expect(summonersByRank).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					rankSolo: rankSolo,
					name: expect.any(String),
					wins: expect.any(Number),
					veteran: expect.any(Boolean),
				}),
			]),
		);
	});

	it.skip("DB => Expect to find all Summoners by Rank - MASTER", async () => {
		const rankSolo: SbLTier = "MASTER";
		const summonersByRank: Summoner[] | null = await summonerRepo.findAllSummonersByRank(rankSolo);

		expect(summonersByRank).not.toBeNull();
		expect(summonersByRank?.length!).toBeGreaterThan(0);

		expect(summonersByRank).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					rankSolo: rankSolo,
					name: expect.any(String),
					wins: expect.any(Number),
					veteran: expect.any(Boolean),
				}),
			]),
		);
	});

	it.skip("DB => Expect Summoner to get deleted", async () => {
		const summonerBeforeDelete: Summoner | null = await summonerRepo.findSummonerByID(
			"idForTestSummoner",
		);

		expect(summonerBeforeDelete).toBeDefined();

		await summonerRepo.deleteSummonerById(summonerBeforeDelete?._id!);

		const summonerAfterDelete = await summonerRepo.findSummonerByID(summonerBeforeDelete?.id!);

		expect(summonerAfterDelete).toBeNull();
	});

	it.skip("DB => SummonerByLeague Challenger Collection", async () => {
		const SbLChallenger = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

		expect(SbLChallenger.entries).toBeDefined();

		expect(SbLChallenger.entries.length).toEqual(300);

		expect(SbLChallenger.tier).toEqual("CHALLENGER");

		expect(SbLChallenger.entries[0]).toEqual(equalSbLEntries());
	});

	it.skip("DB => Update SummonerByLeagueCollection - CHALLENGER", async () => {
		// Get new Summoner By League Collection and save it to Database

		let SbLInDBBeforeUpdate = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

		let newSbL = await RGHttp.getSummonersByLeague("CHALLENGER", "RANKED_SOLO_5x5");

		let SbLInDBAfterUpdate: SummonerByLeague;

		let currentDate = new Date().getTime() * 1000;

		expect(SbLInDBBeforeUpdate.updatedAt).toBeLessThan(currentDate);

		if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLInDBBeforeUpdate)) {
			try {
				await SbLRepo.updateSummonerByLeauge(newSbL.data);

				SbLInDBAfterUpdate = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

				expect(SbLInDBAfterUpdate.updatedAt!).toBeGreaterThan(SbLInDBBeforeUpdate.updatedAt!);

				expect(SbLInDBAfterUpdate.entries).not.toEqual(SbLInDBBeforeUpdate.entries);
			} catch (error) {
				throw error;
			}
		}
	});

	it.skip("DB => Update SummonerByLeagueCollection - GRANDMASTER", async () => {
		// Get new Summoner By League Collection and save it to Database

		let SbLInDBBeforeUpdate = await SbLRepo.findSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

		let newSbL = await RGHttp.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

		let SbLInDBAfterUpdate: SummonerByLeague;

		let currentDate = new Date().getTime() * 1000;

		expect(SbLInDBBeforeUpdate.updatedAt).toBeLessThan(currentDate);

		if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLInDBBeforeUpdate)) {
			try {
				await SbLRepo.updateSummonerByLeauge(newSbL.data);

				SbLInDBAfterUpdate = await SbLRepo.findSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

				expect(SbLInDBAfterUpdate.updatedAt!).toBeGreaterThan(SbLInDBBeforeUpdate.updatedAt!);

				expect(SbLInDBAfterUpdate.entries).not.toEqual(SbLInDBBeforeUpdate.entries);
			} catch (error) {
				throw error;
			}
		}
	});
	it.skip("DB => Update SummonerByLeagueCollection - MASTER", async () => {
		// Get new Summoner By League Collection and save it to Database

		let SbLInDBBeforeUpdate = await SbLRepo.findSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

		let newSbL = await RGHttp.getSummonersByLeague("MASTER", "RANKED_SOLO_5x5");

		let SbLInDBAfterUpdate: SummonerByLeague;

		let currentDate = new Date().getTime() * 1000;

		expect(SbLInDBBeforeUpdate.updatedAt).toBeLessThan(currentDate);

		if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLInDBBeforeUpdate)) {
			try {
				await SbLRepo.updateSummonerByLeauge(newSbL.data);

				SbLInDBAfterUpdate = await SbLRepo.findSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

				expect(SbLInDBAfterUpdate.updatedAt!).toBeGreaterThan(SbLInDBBeforeUpdate.updatedAt!);

				expect(SbLInDBAfterUpdate.entries).not.toEqual(SbLInDBBeforeUpdate.entries);
			} catch (error) {
				throw error;
			}
		}
	});
});

const equalSbLEntries = (): jest.Expect => {
	return expect.objectContaining({
		summonerId: expect.any(String),
		summonerName: expect.any(String),
		leaguePoints: expect.any(Number),
		rank: expect.any(String),
		wins: expect.any(Number),
		losses: expect.any(Number),
		veteran: expect.any(Boolean),
		inactive: expect.any(Boolean),
		freshBlood: expect.any(Boolean),
		hotStreak: expect.any(Boolean),
	});
};
