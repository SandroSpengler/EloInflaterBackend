import axios, {AxiosError} from "axios";

import SummonerByLeague from "../../Models/Interfaces/SummonerByLeague";

import {SummonerByLeagueRepository} from "../../Repository/SummonerByLeagueRepository";
import {SummonerRepository} from "../../Repository/SummonerRepository";

import {RiotGamesHttp} from "../../Services/HttpService";
import {SummonerByLeagueService} from "../../Services/SummonerByLeagueService";

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

    summonerByLeagueMock = require("../../__mock__/Data/SummonerByLeague.json");
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

  describe("HTTP-Requests", () => {
    it("HTTP => Get new SummonerByLeagueCollection - CHALLENGER", async () => {
      // Request SummonerByLeagueCollection from RIOT Games API

      try {
        const reqChallenger = await RGHttpService.getSummonersByLeague(
          "CHALLENGER",
          "RANKED_SOLO_5x5",
        );

        const resChallenger = await reqChallenger.data;

        expect(resChallenger).toBeDefined;

        expect(resChallenger.entries[0]).toEqual(equalSbLEntries());
      } catch (error: unknown | AxiosError) {
        if (!axios.isAxiosError(error)) throw error;

        expect(error.response?.status).toEqual(429);
      }
    });

    it("HTTP => Get new SummonerByLeagueCollection - GRANDMASTER", async () => {
      // Request SummonerByLeagueCollection from RIOT Games API

      try {
        const reqChallenger = await RGHttpService.getSummonersByLeague(
          "GRANDMASTER",
          "RANKED_SOLO_5x5",
        );

        const resChallenger = await reqChallenger.data;

        expect(resChallenger).toBeDefined;

        expect(resChallenger.entries[0]).toEqual(equalSbLEntries());
      } catch (error: unknown | AxiosError) {
        if (!axios.isAxiosError(error)) throw error;

        expect(error.response?.status).toEqual(429);
      }
    });

    it("HTTP => Get new SummonerByLeagueCollection - MASTER", async () => {
      // Request SummonerByLeagueCollection from RIOT Games API

      try {
        const reqChallenger = await RGHttpService.getSummonersByLeague("MASTER", "RANKED_SOLO_5x5");

        const resChallenger = await reqChallenger.data;

        expect(resChallenger).toBeDefined;

        expect(resChallenger.entries[0]).toEqual(equalSbLEntries());
      } catch (error: unknown | AxiosError) {
        if (!axios.isAxiosError(error)) throw error;

        expect(error.response?.status).toEqual(429);
      }
    });

    it("HTTP => Get new SummonerByLeagueCollection - GRANDMASTER", async () => {
      // Request SummonerByLeagueCollection from RIOT Games API

      try {
        const reqChallenger = await RGHttpService.getSummonersByLeague(
          "GRANDMASTER",
          "RANKED_SOLO_5x5",
        );

        const resChallenger = await reqChallenger.data;

        expect(resChallenger).toBeDefined;

        expect(resChallenger.entries[0]).toEqual(equalSbLEntries());
      } catch (error: unknown | AxiosError) {
        if (!axios.isAxiosError(error)) throw error;

        expect(error.response?.status).toEqual(429);
      }
    });

    it("HTTP => Get new SummonerByLeagueCollection - MASTER", async () => {
      // Request SummonerByLeagueCollection from RIOT Games API

      try {
        const reqChallenger = await RGHttpService.getSummonersByLeague(
          "GRANDMASTER",
          "RANKED_SOLO_5x5",
        );

        const resChallenger = await reqChallenger.data;

        expect(resChallenger).toBeDefined;

        expect(resChallenger.entries[0]).toEqual(equalSbLEntries());
      } catch (error: unknown | AxiosError) {
        if (!axios.isAxiosError(error)) throw error;

        expect(error.response?.status).toEqual(429);
      }
    });
  });

  describe("Functions", () => {
    it("Function => checkIfSummonersByLeagueCanBeUpdated", () => {
      expect(SbLService.checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(true);

      // Change Date and assert again

      summonerByLeagueMock.updatedAt = new Date().getTime() * 1000;

      expect(SbLService.checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(false);

      summonerByLeagueMock.updatedAt = new Date().getTime() - 501 * 60 * 1000;

      expect(SbLService.checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(true);
    });
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
