import { match } from "assert";
import { connectToMongoDB } from "../../app";
import { MatchData } from "../../Models/Interfaces/MatchData";
import Summoner from "../../Models/Interfaces/Summoner";

import { MatchRepository } from "../../Repository/MatchRepository";
import { SummonerRepository } from "../../Repository/SummonerRepository";
import { RiotGamesHttp } from "../../Services/Http";
import { MatchService } from "../../Services/MatchService";
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

    summonerMock = require("../TestSampleData/MockSummoner.json");

    await connectToMongoDB(process.env.DB_CONNECTION);
  });

  describe("MongoDB Queries", () => {
    // 2022/10/04 - Check after indexes are built
    it("DB => Expect matches for a Summoner by SummonerPUUID", async () => {
      const matchesForSummonerByPUUID: MatchData[] | null = await matchRepo.findAllMatchesBySummonerPUUID(
        summonerMock.puuid,
      );

      if (matchesForSummonerByPUUID === null) throw new Error();

      expect(matchesForSummonerByPUUID.length).toBeGreaterThan(10);
    });

    it("DB => Expect to find match by MatchID", async () => {
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

        expect(foundMatch._id).toBe(matchIdsToFind[index]);
      }
    });

    it("DB => Expect all matches in DB for MatchList", async () => {
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

  describe("Functions", () => {
    it("Function => All Matches in DB in SummonerMatchList", async () => {
      const summonerInDB = await summonerRepo.findSummonerByPUUID(summonerMock.puuid);

      if (summonerInDB === null) throw new Error("Function => Summoner does not exist in DB");

      try {
        await dataMiningService.addUnassignedMatchesToSummoner(summonerInDB);

        const matchesInDBForSummoner = await matchRepo.findAllMatchesBySummonerPUUID(summonerInDB.puuid);

        const summonerInDBUpdated = await summonerRepo.findSummonerByPUUID(summonerMock.puuid);

        if (summonerInDBUpdated === null) throw new Error();

        expect(summonerInDB.uninflatedMatchList.length + summonerInDB.inflatedMatchList.length).toEqual(
          matchesInDBForSummoner.length,
        );
      } catch (error) {
        throw error;
      }
    });

    it("Function => Add/Update recent Matches for Summoner", async () => {
      // Update Summoner Matches
      /// GET Matches for User eg 73
      // in DB are 73
      // Call update MatchesForUser

      const summonerBeforeUpdate = await summonerRepo.findSummonerByPUUID(summonerMock.puuid);

      if (summonerBeforeUpdate === null) throw new Error("Mock Summoner not found in DB");

      const summonerMatches = await matchRepo.findAllMatchesBySummonerPUUID(summonerMock.puuid);

      expect(summonerBeforeUpdate.uninflatedMatchList.length + summonerBeforeUpdate.inflatedMatchList.length).toEqual(
        summonerMatches.length,
      );

      try {
        await dataMiningService.addNewMatchesToSummoner(summonerBeforeUpdate);
      } catch (error) {
        // console.log(error);
        throw error;
      }
    });
  });
});
