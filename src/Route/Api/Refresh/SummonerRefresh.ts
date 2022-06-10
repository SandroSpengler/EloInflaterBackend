const express = require("express");
const router = express.Router();

import axios, { Axios, AxiosResponse, AxiosError } from "axios";
import { Request, response, Response, Router } from "express";
import { IMatchSchema } from "../../../Models/Interfaces/MatchList";
import Summoner from "../../../Models/Interfaces/Summoner";
import { EntriesByLeague } from "../../../Models/Interfaces/SummonerByLeague";
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
    router.get("/byQueue/:queueType/:queueMode", this.getByQueueModeAndType);
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

  public getPUUID = async (req: Request, res: Response) => {
    try {
      const summonerInDB = await this.summonerRepo.findSummonerByPUUID(req.params.puuid);

      if (summonerInDB) {
        await this.matchService.checkSummonerMatchesForEloInflation(summonerInDB);

        return res.status(200).json({
          success: true,
          result: `Summoner has been updated`,
        });
      }
      return res.status(409).json({
        success: true,
        result: `Summoner was not updated `,
      });
    } catch (error) {}
  };

  public getByQueueModeAndType = async (req: Request, res: Response) => {
    let queueType = req.params.queueType;
    let queueMode = req.params.queueMode;

    try {
      const Response = await this.RGHttp.getSummonersByLeague(queueType, queueMode);

      let summonerByLeagueInDB = await this.SbLRepo.findSummonerByLeague(queueType, queueMode);

      if (summonerByLeagueInDB == null) {
        // If it does save Summoner to DB
        summonerByLeagueInDB = await this.SbLRepo.saveSummonerByLeague(Response.data);
      }

      if (summonerByLeagueInDB.updatedAt! < new Date().getTime()) {
        // Updates the Summoners Entries
        await this.SbLRepo.updateSummonerByLeague(queueType, Response.data.entries);
        // Saves the Summoner to DB
        await this.summonerService.updateSumonersByQueue(summonerByLeagueInDB);
      }

      // save rankedinformation to that summoner

      let summonerByLeagueToSend = formatSummonerByLeagueForSending(summonerByLeagueInDB);

      res.status(200).json({
        success: true,
        result: summonerByLeagueToSend,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
new SummonerRefreshRoute();

module.exports = router;
