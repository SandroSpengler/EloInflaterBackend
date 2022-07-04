import axios, { AxiosError } from "axios";
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

    await connectToMongoDB(process.env.DB_CONNECTION);
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
    it("DB => SummonerByLeague Challenger Collection", async () => {
      const SbLChallenger = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

      expect(SbLChallenger.entries).toBeDefined();

      expect(SbLChallenger.entries.length).toEqual(300);

      expect(SbLChallenger.tier).toEqual("CHALLENGER");

      expect(SbLChallenger.entries[0]).toEqual(equalSbLEntries());
    });

    it("DB => Update SummonerByLeagueCollection - CHALLENGER", async () => {
      // Get new Summoner By League Collection and save it to Database

      let SbLInDBBeforeUpdate = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

      let newSbL = await RGHttpService.getSummonersByLeague("CHALLENGER", "RANKED_SOLO_5x5");

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

    it("DB => Update SummonerByLeagueCollection - GRANDMASTER", async () => {
      // Get new Summoner By League Collection and save it to Database

      let SbLInDBBeforeUpdate = await SbLRepo.findSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

      let newSbL = await RGHttpService.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

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
    it("DB => Update SummonerByLeagueCollection - MASTER", async () => {
      // Get new Summoner By League Collection and save it to Database

      let SbLInDBBeforeUpdate = await SbLRepo.findSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

      let newSbL = await RGHttpService.getSummonersByLeague("MASTER", "RANKED_SOLO_5x5");

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

  describe("HTTP-Requests", () => {
    it("HTTP => Get new SummonerByLeagueCollection - CHALLENGER", async () => {
      // Request SummonerByLeagueCollection from RIOT Games API

      try {
        const reqChallenger = await RGHttpService.getSummonersByLeague("CHALLENGER", "RANKED_SOLO_5x5");

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
        const reqChallenger = await RGHttpService.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

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
        const reqChallenger = await RGHttpService.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

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
        const reqChallenger = await RGHttpService.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

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

      summonerByLeagueMock.updatedAt = new Date().getTime() - 300 * 1000;

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
