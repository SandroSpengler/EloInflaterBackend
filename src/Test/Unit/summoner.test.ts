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
      exhaustCount: 0,
      exhaustCastCount: 0,
      tabisCount: 0,
      zhonaysCount: 0,
      zhonaysCastCount: 0,
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

      // now - 10 Hours
      summonerMock.lastMatchUpdate = new Date().getTime() - 10 * 60 * 60 * 1000;

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

    it.skip("Function => update Summoner by SbLCollection - GRANDMASTER", async () => {
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

    it("404 Error", async () => {
      const summoner = {
        _id: "s-SHlZkUSFdOFYwTBULelp9Vb3SY8QSPwXIaoAzQKIYW53_P",
        profileIconId: 4655,
        revisionDate: 1657479477000,
        summonerLevel: 82,
        leaguePoints: 45,
        rank: "I",
        rankSolo: "MASTER",
        flexSolo: "",
        flextt: "",
        wins: 49,
        losses: 25,
        veteran: false,
        inactive: false,
        freshBlood: false,
        hotStreak: false,
        inflatedMatchList: [
          "EUW1_5932426571",
          "EUW1_5922789545",
          "EUW1_5949565031",
          "EUW1_5884706197",
          "EUW1_5916961174",
          "EUW1_5905789859",
          "EUW1_5905559873",
          "EUW1_5905253219",
          "EUW1_5886025373",
          "EUW1_5884949961",
          "EUW1_5884871213",
          "EUW1_5875262028",
          "EUW1_5872736278",
          "EUW1_5870626890",
          "EUW1_5867833559",
          "EUW1_5866498975",
          "EUW1_5864981274",
          "EUW1_5864828517",
          "EUW1_5863020020",
          "EUW1_5858327962",
          "EUW1_5857378048",
          "EUW1_5857342665",
          "EUW1_5851127609",
          "EUW1_5850599762",
          "EUW1_5850427339",
          "EUW1_5849701542",
          "EUW1_5849595110",
          "EUW1_5710294182",
          "EUW1_5322484027",
          "EUW1_5319555893",
        ],
        uninflatedMatchList: [
          "EUW1_5710534151",
          "EUW1_5955061035",
          "EUW1_5936643208",
          "EUW1_5932362776",
          "EUW1_5912708616",
          "EUW1_5919413303",
          "EUW1_5959798097",
          "EUW1_5963402550",
          "EUW1_5890101166",
          "EUW1_5953241112",
          "EUW1_5900945391",
          "EUW1_5955046532",
          "EUW1_5925622686",
          "EUW1_5857305169",
          "EUW1_5863663640",
          "EUW1_5884681831",
          "EUW1_5973047562",
          "EUW1_5923852841",
          "EUW1_5905580276",
          "EUW1_5905159175",
          "EUW1_5902797047",
          "EUW1_5886487343",
          "EUW1_5884990883",
          "EUW1_5884798498",
          "EUW1_5875298883",
          "EUW1_5874670863",
          "EUW1_5866514613",
          "EUW1_5866478891",
          "EUW1_5865137964",
          "EUW1_5865118565",
          "EUW1_5864946529",
          "EUW1_5864881907",
          "EUW1_5863420431",
          "EUW1_5863365293",
          "EUW1_5863371953",
          "EUW1_5858365920",
          "EUW1_5858372000",
          "EUW1_5850917605",
          "EUW1_5850728974",
          "EUW1_5850677012",
          "EUW1_5850594942",
          "EUW1_5850571294",
          "EUW1_5850442333",
          "EUW1_5849754995",
          "EUW1_5845967849",
          "EUW1_5710363746",
          "EUW1_5637604020",
        ],
        exhaustCount: 3,
        exhaustCastCount: 12,
        tabisCount: 17,
        zhonaysCount: 11,
        zhonaysCastCount: 0,
        id: "s-SHlZkUSFdOFYwTBULelp9Vb3SY8QSPwXIaoAzQKIYW53_P",
        summonerId: "s-SHlZkUSFdOFYwTBULelp9Vb3SY8QSPwXIaoAzQKIYW53_P",
        accountId: "-1S8FOZvARqQRLDOd-2GGhESk8W2nbRZx1S_X-4WvZ1Ryk2gD1sEkJSp",
        puuid: "Gptk_MfvrxWCYyru6gow7lKoy_jfQ-IzTCIW-nrZF_ipCNZo6nvYC3TGOxRqoL2m9vr9Xs7IduUG_w",
        name: "Viktor Sheen Fan",
        updatedAt: 1658048627898,
        createdAt: 1657071395693,
        __v: 0,
      };

      try {
        const matches = await RGHttp.getMatchesIdsBySummonerpuuid(summoner.puuid);

        console.log(matches);
      } catch (error: any) {
        console.log(error.message);
      }
    });
  });
});
