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

  describe("Functions", () => {
    it("Function => checkIfSummonersByLeagueCanBeUpdated", () => {
      expect(SbLService.checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(true);

      // Change Date and assert again
    });
  });
});
