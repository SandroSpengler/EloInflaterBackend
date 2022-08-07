import Summoner from "../../Models/Interfaces/Summoner";

import { RiotGamesHttp } from "../../Services/Http";
import { SummonerByLeagueService } from "../../Services/SummonerByLeagueService";
import { SummonerService } from "../../Services/SummonerService";

import { SummonerByLeagueRepository } from "../../Repository/SummonerByLeagueRepository";
import { SummonerRepository } from "../../Repository/SummonerRepository";

import { mockFindSummonerByLeague } from "../../__mock__/Logic/SbLRepo";
import { mockFindSummonerByRank } from "../../__mock__/Logic/SummonerRepo";

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

    // ToDo
    // Add Typescript typings
    summonerRepoMock = jest.mock("../../Repository/SummonerRepository");
    SbLRepoMock = jest.mock("../../Repository/SummonerByLeagueRepository");

    summonerServiceMock = jest.mock("../../Repository/SummonerByLeagueRepository");
  });

  describe("Summoner Function Tests", () => {
    beforeEach(() => {
      // 1. Mock Repository for Database Functions
      // 1.1 updateSummonerBySummonerID
      // 1.2 findSummonerByID
      // 1.3 createSummoner
      // 1.4 updateSummonerBySummonerID
      summonerRepoMock.findAllSummonersByRank = mockFindSummonerByRank;

      // Inject SummonerRepoMock into SummonerService
      summonerService = new SummonerService(summonerRepoMock, RGHttp);
    });

    it("Function => checkIfSummonerCanBeUpdated", () => {
      let currentDate = new Date().getTime();

      expect(summonerMock?.updatedAt!).toBeLessThan(currentDate);

      expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(true);

      summonerMock.updatedAt = currentDate;

      expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(false);

      // now - 10 Hours
      summonerMock.updatedAt = new Date().getTime() - 10 * 60 * 60 * 1000;

      expect(summonerService.checkIfSummonerCanBeUpdated(summonerMock)).toEqual(true);
    });

    it("Function => update Summoner by SbLCollection - CHALLENGER", async () => {
      const SblDbMock = mockFindSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

      if (SblDbMock === null) throw new Error("SummonerByLeague not found in MockData");

      await summonerService.updateSumonersByLeague(SblDbMock);
    });

    it.skip("Function => update Summoner by SbLCollection - GRANDMASTER", async () => {
      const SbLInDB = await SbLRepo.findSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

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

    it.skip("Function => validate SummonerInformation by SummonerId", async () => {
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

    it.skip("404 Error", async () => {
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
