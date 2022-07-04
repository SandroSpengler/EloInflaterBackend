const express = require("express");
const router = express.Router();

import axios, { Axios, AxiosResponse, AxiosError } from "axios";
import { Request, response, Response, Router } from "express";
import Summoner from "../../../Models/Interfaces/Summoner";
import { SbLQueue, SbLTier } from "../../../Models/Types/SummonerByLeagueTypes";
import { MatchRepository } from "../../../Repository/MatchRepository";

import { SummonerByLeagueRepository } from "../../../Repository/SummonerByLeagueRepository";
import { SummonerRepository } from "../../../Repository/SummonerRepository";

import { formatSummonerByLeagueForSending, formatSummonerForSending } from "../../../Services/FormatDocument";
import { RiotGamesHttp } from "../../../Services/Http";
import { MatchService } from "../../../Services/MatchService";
import { SummonerService } from "../../../Services/SummonerService";

export class SummonerRefreshRoute {
  private summonerRepo: SummonerRepository = new SummonerRepository();
  private summonerService: SummonerService = new SummonerService(this.summonerRepo);

  private SbLRepo: SummonerByLeagueRepository = new SummonerByLeagueRepository();

  private RGHttp: RiotGamesHttp = new RiotGamesHttp();

  private matchRepo: MatchRepository = new MatchRepository();
  private matchService: MatchService = new MatchService(this.matchRepo);

  constructor() {
    router.get("/byName/:name", this.getByName);
    router.get("/byPUUID/:puuid", this.getPUUID);
    router.put("/byQueue/:tier/:queue", this.putByQueueModeAndType);
  }

  public getByName = async (req: Request, res: Response) => {
    let summonerByNameApiReponse;
    let summonerInDB: Summoner | null;

    if (!req.params.name) return res.status(409).json({ success: false, result: "Check Summoner Name" });

    try {
      // Get Summoner Data

      summonerInDB = await this.summonerRepo.findSummonerByName(req.params.name);

      if (summonerInDB === null) {
        summonerByNameApiReponse = await this.RGHttp.getSummonerByName(req.params.name);

        summonerInDB = await this.summonerRepo.createSummoner(summonerByNameApiReponse.data);
      }
    } catch (error: any) {
      return res.status(500).json({
        succes: false,
        result: error.message,
      });
    }

    // if (summonerInDB.updatedAt! < new Date().getTime() - 3600 * 1000) {
    if (!this.summonerService.checkIfSummonerCanBeUpdated(summonerInDB)) {
      return res.status(409).json({
        success: false,
        result: "Summoner already been updated within the last hour",
      });
    }

    try {
      // await updatSummonerMatches(summonerInDB);

      return res.status(200).json({
        success: true,
        result: `Summoner has been updated`,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        let axiosError: AxiosError = error;

        if (axiosError.response?.status === 429) {
          // Add Summoner to list of summoners that need updating

          return res.status(429).json({
            success: true,
            result: `Summoner was not updated ${error.message}`,
          });
        }
      }

      return res.status(409).json({
        success: true,
        result: `Summoner was not updated ${error.message}`,
      });
    }
  };

  /**
   * Finds Summoner by PUUID
   *
   * @param req The HTTP-Request
   * @param res The HTTP Response
   */
  public getPUUID = async (req: Request, res: Response) => {
    try {
      const summonerInDB = await this.summonerRepo.findSummonerByPUUID(req.params.puuid);

      if (summonerInDB) {
        await this.matchService.checkSummonerMatchesForEloInflation(summonerInDB);

        return res.status(200).json({
          success: true,
          result: `Summoner has been updated`,
          error: null,
        });
      }
      return res.status(409).json({
        success: true,
        result: `Summoner was not updated `,
        error: null,
      });
    } catch (error) {}
  };

  /**
   * PUT Express Endpoint: Updates SummonerByLeagueCollection for specific tier and queue
   *
   * @param req The HTTP-Request
   * @param res The HTTP Response
   */
  public putByQueueModeAndType = async (req: Request, res: Response) => {
    let tier: SbLTier;
    let queue: SbLQueue;

    // GuardClose -> Params must contain strings inside the Array
    if (!["CHALLENGER", "GRANDMASTER", "MASTER"].includes(req.params.tier)) {
      return res.status(400).json({
        success: false,
        result: null,
        error: `Parameter Tier does not match "CHALLENGER", "GRANDMASTER" or "MASTER"`,
      });
    }

    if (!["RANKED_SOLO_5x5", "RANKED_FLEX_SR", "RANKED_FLEX_TT"].includes(req.params.queue)) {
      return res.status(400).json({
        success: false,
        result: null,
        error: `Parameter Queue does not match "RANKED_SOLO_5x5", "RANKED_FLEX_SR" or "RANKED_FLEX_TT"`,
      });
    }

    // Needs to be casted due to Typescript not understanding the if-statement check
    tier = req.params.tier as SbLTier;
    queue = req.params.queue as SbLQueue;

    // 1. Get current SummonersByLeague from API ✅
    // 2. Get SummonersByLeague in DB ✅
    //    Save them if no SummonersByLeague exist ✅
    // 3. Check if SummonersByLeauge can be updated
    // 4. Update SummonersByLeauge
    // 5. Return Status Code

    try {
      const Response = await this.RGHttp.getSummonersByLeague(tier, queue);

      let summonerByLeagueInDB = await this.SbLRepo.findSummonerByLeague(tier, queue);

      if (summonerByLeagueInDB == null) {
        // If it does save Summoner to DB
        summonerByLeagueInDB = await this.SbLRepo.saveSummonerByLeague(Response.data);
      }

      if (summonerByLeagueInDB.updatedAt! < new Date().getTime()) {
        // Updates the Summoners Entries
        await this.SbLRepo.updateSummonerByLeagueEntries(tier, Response.data.entries);
        // Saves the Summoner to DB
        await this.summonerService.updateSumonersByQueue(summonerByLeagueInDB);
      }

      // save rankedinformation to that summoner

      let summonerByLeagueToSend = formatSummonerByLeagueForSending(summonerByLeagueInDB);

      res.status(200).json({
        success: true,
        result: summonerByLeagueToSend,
        error: null,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, result: null, error: error.message });
    }
  };
}
new SummonerRefreshRoute();

module.exports = router;
