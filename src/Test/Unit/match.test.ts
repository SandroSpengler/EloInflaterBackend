import { match } from "assert";
import { connectToMongoDB } from "../../app";
import { MatchData } from "../../Models/Interfaces/MatchData";

import { MatchRepository } from "../../Repository/MatchRepository";

describe("Match", () => {
  describe("MongoDB Queries", () => {
    let summonerPUUID;

    let matchRepo: MatchRepository;

    beforeAll(async () => {
      matchRepo = new MatchRepository();

      await connectToMongoDB();

      // forevermates - PUUID
      summonerPUUID = "tep5qDEJjHDwq81f6gxcwDc4V_G46emxRwZzXiNhKI0NWnKe4IZ0B6MCj6aMl2UplKs0haX4f-xTnA";
    });

    // 2022/10/04 - Check after indexes are built
    it.skip("Expect matches for a Summoner by SummonerPUUID", async () => {
      const matchesForSummonerByPUUID: MatchData[] | null = await matchRepo.findAllMatchesBySummonerPUUID(
        summonerPUUID,
      );

      if (matchesForSummonerByPUUID === null) throw new Error();

      expect(matchesForSummonerByPUUID.length).toBeGreaterThan(10);
    }, 30000);

    it("Expect to find match by MatchID", async () => {
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

    it("Expect all matches in DB for MatchList", async () => {
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

    it("Expect new Summoner Matches or 429", async () => {
      // User JSON Data for that
      // const summoner = await findSummonerByPUUID(summonerPUUID);
      // let currentMatchList = summoner.matchList;
    });
  });
});
