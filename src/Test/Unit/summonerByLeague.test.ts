import { connectToMongoDB } from "../../app";
import SummonerByLeague from "../../Models/Interfaces/SummonerByLeague";
import { SummonerByLeagueRepository } from "../../Repository/SummonerByLeagueRepository";
import { SummonerRepository } from "../../Repository/SummonerRepository";
import { RiotGamesHttp } from "../../Services/Http";

import { SummonerByLeagueService } from "../../Services/SummonerByLeagueService";

describe("Summoner by Leauge Functions", () => {
  let SummonerRepo: SummonerRepository;

  let SbLRepo: SummonerByLeagueRepository;
  let SbLService: SummonerByLeagueService;

  let RGHttpService: RiotGamesHttp;

  let summonerByLeagueMock: SummonerByLeague;

  beforeAll(async () => {
    SummonerRepo = new SummonerRepository();
    SbLRepo = new SummonerByLeagueRepository();
    RGHttpService = new RiotGamesHttp();

    SbLService = new SummonerByLeagueService(SbLRepo, SummonerRepo, RGHttpService);

    summonerByLeagueMock = require("../TestSampleData/MockSummonerByLeague.json");

    await connectToMongoDB();
  });

  describe("Setup", () => {
    it("Check dependency setup", () => {
      expect(SummonerRepo).toBeDefined();
      expect(SbLRepo).toBeDefined();
      expect(SbLService).toBeDefined();
      expect(RGHttpService).toBeDefined();
      expect(summonerByLeagueMock).toBeDefined();
    });
  });

  describe("MongoDB Queries", () => {
    it("Find SummonerByLeague Challenger Collection", async () => {
      const SbLChallenger = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

      expect(SbLChallenger.entries).toBeDefined();

      expect(SbLChallenger.entries.length).toEqual(300);
    });
  });

  describe("HTTP-Requests", () => {
    it("HTTP => Get new SummonerByLeagueCollection", () => {
      // Request SummonerByLeagueCollection from RIOT Games API
    });
  });

  describe("Functions", () => {
    it("Function => checkIfSummonersByLeagueCanBeUpdated", () => {
      expect(SbLService.checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(true);

      // Change Date and assert again

      summonerByLeagueMock.updatedAt = new Date().getTime() * 1000;

      expect(SbLService.checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(false);

      summonerByLeagueMock.updatedAt = new Date().getTime() - 300 * 1000;

      expect(SbLService.checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(true);
    });

    it("Function => Update SummonerByLeagueCollection", () => {
      // Get new Summoner By League Collection and save it to Database
    });
  });
});
