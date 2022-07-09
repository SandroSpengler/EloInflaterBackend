import { connectToMongoDB } from "../../app";
import Summoner from "../../Models/Interfaces/Summoner";
import { SbLTier } from "../../Models/Types/SummonerByLeagueTypes";
import { SummonerByLeagueRepository } from "../../Repository/SummonerByLeagueRepository";

import { SummonerRepository } from "../../Repository/SummonerRepository";
import { RiotGamesHttp } from "../../Services/Http";
import { SummonerByLeagueService } from "../../Services/SummonerByLeagueService";
import { SummonerService } from "../../Services/SummonerService";

// import SampleSummoner from "../../Test/TestSampleData/SampleSummoner.json";

describe("Summoner", () => {
  let summonerMock: Summoner;

  let summonerRepo: SummonerRepository;
  let summonerService: SummonerService;

  let SbLRepo: SummonerByLeagueRepository;
  let SbLService: SummonerByLeagueService;

  let RGHttp: RiotGamesHttp;

  beforeAll(async () => {
    summonerMock = require("../TestSampleData/MockSummoner.json");

    RGHttp = new RiotGamesHttp();

    summonerRepo = new SummonerRepository();
    summonerService = new SummonerService(summonerRepo, RGHttp);

    SbLRepo = new SummonerByLeagueRepository();
    SbLService = new SummonerByLeagueService(SbLRepo, summonerRepo, RGHttp);

    await connectToMongoDB(process.env.DB_CONNECTION);

    const summonerToCreate: Summoner = {
      id: "idForTestSummoner",
      summonerId: "summonerIdForTestSummoner",
      accountId: "accountIdForTestSummoner",
      puuid: "puuIdForTestSummoner",
      name: "test summoner",
      profileIconId: 10,
      revisionDate: 20,
      summonerLevel: 40,
      uninflatedMatchList: [
        "EUW1_5719815682",
        "EUW1_5747055907",
        "EUW1_5782762281",
        "EUW1_5782658595",
        "EUW1_5723924098",
        "EUW1_5710227574",
        "EUW1_5721290766",
      ],
      inflatedMatchList: [],
    };

    await summonerRepo.createSummoner(summonerToCreate);
  });

  describe("MongoDB Queries", () => {
    it("DB => Expect to find Summoner By Name", async () => {
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

    it("DB => Expect to find Summoner By PUUID", async () => {
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

    it("DB => Expect to find Summoner By ID", async () => {
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

    it("DB => Expect to find all Summoners by Rank - CHALLENGER", async () => {
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

    it("DB => Expect to find all Summoners by Rank - GRANDMASTER", async () => {
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

    it("DB => Expect to find all Summoners by Rank - MASTER", async () => {
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

    it("DB => Expect Summoner to get deleted", async () => {
      const summonerBeforeDelete: Summoner | null = await summonerRepo.findSummonerByID("idForTestSummoner");

      expect(summonerBeforeDelete).toBeDefined();

      await summonerRepo.deleteSummonerById(summonerBeforeDelete?._id!);

      const summonerAfterDelete = await summonerRepo.findSummonerByID(summonerBeforeDelete?.id!);

      expect(summonerAfterDelete).toBeNull();
    });
  });

  describe("Summoner Function Tests", () => {
    it("Function => checkIfSummonerCanBeUpdated", () => {
      // sampleSummoner.updatedAt = 2022-06-08T17:58:00+00:00

      let currentDate = new Date().getTime();

      expect(summonerMock.lastMatchUpdate).toEqual(1648473700836);

      expect(summonerMock?.lastMatchUpdate!).toBeLessThan(currentDate);

      expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(true);

      summonerMock.lastMatchUpdate = currentDate;

      expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(false);

      // now - 3 Hours
      summonerMock.lastMatchUpdate = new Date().getTime() - 300 * 1000;

      expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(true);
    });

    it("Function => update Summoner by SbLCollection - CHALLENGER", async () => {
      const SbLInDB = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

      if (await SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLInDB)) {
        return;
      }

      await summonerService.updateSumonersByLeague(SbLInDB);

      const summonersInDB = await summonerRepo.findAllSummonersByRank("CHALLENGER");

      for (let summoner of summonersInDB) {
        const summonerInSbL = SbLInDB.entries.find((entry) => entry.summonerId === summoner.id);

        expect(summoner.id).toEqual(summonerInSbL?.summonerId);
      }
    });

    it("Function => update Summoner by SbLCollection - GRANDMASTER", async () => {
      const SbLInDB = await SbLRepo.findSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

      if (await SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLInDB)) {
        return;
      }

      await summonerService.updateSumonersByLeague(SbLInDB);

      const summonersInDB = await summonerRepo.findAllSummonersByRank("GRANDMASTER");

      for (let summoner of summonersInDB) {
        const summonerInSbL = SbLInDB.entries.find((entry) => entry.summonerId === summoner.id);

        expect(summoner.id).toEqual(summonerInSbL?.summonerId);
      }
    });

    // Too large to execute everytime
    it.skip("Function => update Summoner by SbLCollection - MASTER", async () => {
      const SbLInDB = await SbLRepo.findSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

      if (await SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLInDB)) {
        return;
      }

      await summonerService.updateSumonersByLeague(SbLInDB);

      const summonersInDB = await summonerRepo.findAllSummonersByRank("MASTER");

      for (let summoner of summonersInDB) {
        const summonerInSbL = SbLInDB.entries.find((entry) => entry.summonerId === summoner.id);

        expect(summoner.id).toEqual(summonerInSbL?.summonerId);
      }
    }, 45000);

    it("Function => validate SummonerInformation by SummonerId", async () => {
      try {
        await summonerService.validateSummonerById(undefined as any);
      } catch (error: any) {
        expect(error.message).toContain("No SummonerId provided");
      }

      try {
        // Need to mock DB here
        await summonerService.validateSummonerById(summonerMock.summonerId);
      } catch (error) {
        console.log(error);
      }
    });
  });
});
