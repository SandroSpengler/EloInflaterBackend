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
  private RGHttp: RiotGamesHttp = new RiotGamesHttp();

  private summonerRepo: SummonerRepository = new SummonerRepository();
  private summonerService: SummonerService = new SummonerService(this.summonerRepo, this.RGHttp);

  private SbLRepo: SummonerByLeagueRepository = new SummonerByLeagueRepository();

  private matchRepo: MatchRepository = new MatchRepository();
  private matchService: MatchService = new MatchService(this.matchRepo, this.RGHttp);

  constructor() {
    router.put("/byName/:name", this.getByName);
    router.put("/byPUUID/:puuid", this.getPUUID);
  }

  public getByName = async (req: Request, res: Response) => {
    // Check if summoner exsits in DB
    // Add Summoner to DB in not exists
    // Update Summoner matches
    // Res => Summoner updated

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
        // await this.matchService.checkSummonerMatchesForEloInflation(summonerInDB);

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
}
new SummonerRefreshRoute();

module.exports = router;
