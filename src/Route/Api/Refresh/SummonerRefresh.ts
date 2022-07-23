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
    router.put("/bySummonerId/:summonerId", this.putSummonerId);
  }

  /**
   * Update SummonerInformation by PUUID
   *
   * @param req The HTTP-Request
   * @param res The HTTP Response
   */
  public putSummonerId = async (req: Request, res: Response) => {
    // ToDo
    // also update Summoner Rankinformation
    try {
      const summonerId: string = req.params.summonerId;

      if (summonerId === undefined || summonerId === "") {
        return res.status(400).json({
          success: false,
          result: null,
          erorr: "No SummonerPUUID was provided",
        });
      }

      const summonerInDB = await this.summonerRepo.findSummonerByID(summonerId);

      if (summonerInDB === null) {
        return res.status(404).json({
          success: false,
          result: null,
          erorr: "Summoner does not exist in DB",
        });
      }

      if (!this.summonerService.checkIfSummonerCanBeUpdated(summonerInDB)) {
        return res.status(410).json({
          success: false,
          result: null,
          erorr: "Summoner already updated within the last 2 Minutes",
        });
      }

      const currentSummonerResponse = await this.RGHttp.getSummonerBySummonerId(summonerInDB.id);

      await this.summonerRepo.updateSummonerByPUUID(currentSummonerResponse.data);

      const updatedSummoner = await this.summonerRepo.findSummonerByID(summonerId);

      return res.status(200).json({
        success: true,
        result: updatedSummoner,
        error: null,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        let axiosError: AxiosError = error;

        if (axiosError.response?.status === 404) {
          return res.status(404).json({
            success: false,
            result: null,
            error: "Summoner not found",
          });
        }

        if (axiosError.response?.status === 429) {
          return res.status(429).json({
            success: false,
            result: null,
            error: "Rate limit reached please try again later",
          });
        }
      }

      return res.status(500).json({ succes: false, result: "Internal Server Error" });
    }
  };
}
new SummonerRefreshRoute();

module.exports = router;
