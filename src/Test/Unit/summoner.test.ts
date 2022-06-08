import { connectToMongoDB } from "../../app";
import Summoner from "../../Models/Interfaces/Summoner";
import {
  findAllSummoners,
  findSummonerByName,
  findSummonerByPUUID,
  findSummonerByID,
  findAllSummonersByRank,
  createSummoner,
  deleteSummonerById,
  checkIfSummonerCanBeUpdated,
} from "../../Repository/SummonerRepository";

// import SampleSummoner from "../../Test/TestSampleData/SampleSummoner.json";

describe("Summoner", () => {
  let summonerMock: Summoner;

  beforeAll(async () => {
    summonerMock = require("../TestSampleData/SampleSummoner.json");

    await connectToMongoDB();

    const summonerToCreate: Summoner = {
      id: "idForTestSummoner",
      summonerId: "summonerIdForTestSummoner",
      accountId: "accountIdForTestSummoner",
      puuid: "puuIdForTestSummoner",
      name: "test summoner",
      profileIconId: 10,
      revisionDate: 20,
      summonerLevel: 40,
      matchList: [
        "EUW1_5719815682",
        "EUW1_5747055907",
        "EUW1_5782762281",
        "EUW1_5782658595",
        "EUW1_5723924098",
        "EUW1_5710227574",
        "EUW1_5721290766",
      ],
    };

    await createSummoner(summonerToCreate);
  });

  describe("MongoDB Queries", () => {
    it("Expect to find Summoner By Name", async () => {
      // still case sensitive
      const summonerName: string = "test summoner";

      const summoner: Summoner | null = await findSummonerByName(summonerName);

      expect(summoner).not.toBeNull();

      expect(summoner).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          name: summonerName,
          matchList: expect.arrayContaining([expect.any(String)]),
          puuid: expect.any(String),
          tabisCount: expect.any(Number),
          summonerLevel: expect.any(Number),
        }),
      );
    });

    it("Expect to find Summoner By PUUID", async () => {
      const summonerPUUID: string = "puuIdForTestSummoner";
      const summonerName = "test summoner";

      const summoner: Summoner | null = await findSummonerByPUUID(summonerPUUID);

      expect(summoner).not.toBeNull();

      expect(summoner).toEqual(
        expect.objectContaining({
          _id: expect.anything(),
          puuid: summonerPUUID,
          name: summonerName,
          matchList: expect.arrayContaining([expect.any(String)]),
          tabisCount: expect.any(Number),
          summonerLevel: expect.any(Number),
        }),
      );
    });

    it("Expect to find Summoner By ID", async () => {
      const summonerId: string = "idForTestSummoner";
      const summonerName = "test summoner";

      const summoner: Summoner | null = await findSummonerByID(summonerId);

      expect(summoner).not.toBeNull();

      expect(summoner).toEqual(
        expect.objectContaining({
          _id: summonerId,
          name: summonerName,
          matchList: expect.arrayContaining([expect.any(String)]),
          tabisCount: expect.any(Number),
          summonerLevel: expect.any(Number),
        }),
      );
    });

    it("Expect to find all Summoners by Rank - CHALLENGER", async () => {
      const rankSolo: string = "CHALLENGER";
      const summonersByRank: Summoner[] | null = await findAllSummonersByRank(rankSolo);

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
    it("Expect to find all Summoners by Rank - GRANDMASTER", async () => {
      const rankSolo: string = "GRANDMASTER";
      const summonersByRank: Summoner[] | null = await findAllSummonersByRank(rankSolo);

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
    it("Expect to find all Summoners by Rank - MASTER", async () => {
      const rankSolo: string = "MASTER";
      const summonersByRank: Summoner[] | null = await findAllSummonersByRank(rankSolo);

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

    it("Expect Summoner to get deleted", async () => {
      const summonerBeforeDelete: Summoner | null = await findSummonerByID("idForTestSummoner");

      expect(summonerBeforeDelete).toBeDefined();

      await deleteSummonerById(summonerBeforeDelete?._id!);

      const summonerAfterDelete = await findSummonerByID(summonerBeforeDelete?.id!);

      expect(summonerAfterDelete).toBeNull();
    });
  });

  describe("Summoner Function Tests", () => {
    it("Function => checkIfSummonerCanBeUpdated", () => {
      // sampleSummoner.updatedAt = 2022-06-08T17:58:00+00:00

      let currentDate = new Date().getTime();

      expect(summonerMock.lastMatchUpdate).toEqual(1648473700836);

      expect(summonerMock?.lastMatchUpdate!).toBeLessThan(currentDate);

      expect(checkIfSummonerCanBeUpdated(summonerMock)).toEqual(true);

      summonerMock.lastMatchUpdate = currentDate;

      expect(checkIfSummonerCanBeUpdated(summonerMock)).toEqual(false);

      // now - 3 Hours
      summonerMock.lastMatchUpdate = new Date().getTime() - 300 * 1000;

      expect(checkIfSummonerCanBeUpdated(summonerMock)).toEqual(true);
    });
  });
});
