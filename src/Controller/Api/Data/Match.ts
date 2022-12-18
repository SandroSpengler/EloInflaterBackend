import axios from "axios";
import { Request, Response } from "express";
import { MatchData } from "../../../Models/Interfaces/MatchData";
import Summoner from "../../../Models/Interfaces/Summoner";
import { MatchRepository } from "../../../Repository/MatchRepository";
import { SummonerRepository } from "../../../Repository/SummonerRepository";
import { RiotGamesHttp } from "../../../Services/HttpService";
import { MatchService } from "../../../Services/MatchService";
import { SummonerService } from "../../../Services/SummonerService";

const express = require("express");
const router = express.Router();

export class MatchRoute {
  private RGHttp: RiotGamesHttp = new RiotGamesHttp();

  private summonerRepo: SummonerRepository = new SummonerRepository();
  private summonerService: SummonerService = new SummonerService(this.summonerRepo, this.RGHttp);

  private matchRepo: MatchRepository = new MatchRepository();
  private matchService: MatchService = new MatchService(this.matchRepo, this.RGHttp);

  constructor() {
    router.get("/:name", this.matchByName);
  }

  /**
   * @openapi
   * /api/data/match/{summonerName}:
   *  get:
   *    produces:
   *      - application/json
   *    tags:
   *      - Match
   *    parameters:
   *      - in: path
   *        name: summonerName
   *        required: true
   *        type: string
   *    description: Provides all Matches for a specified Summoner
   *    responses:
   *      200:
   *        $ref: '#/components/responses/SuccesMultipleMatch'
   *      400:
   *         $ref: '#/components/responses/BadRequest'
   *      404:
   *         $ref: '#/components/responses/NotFound'
   *      429:
   *         $ref: '#/components/responses/TooManyRequests'
   *      500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  public matchByName = async (req: Request, res: Response) => {
    let summonerName: string = req.params.name;
    let summoner: Summoner | null;

    if (!summonerName) {
      res.status(404).json({ success: false, message: "name not found" });
    }

    try {
      summoner = await this.summonerRepo.findSummonerByName(summonerName);

      if (summoner === null) {
        return res.status(404).send();
      }
    } catch (error: any) {
      res.status(500).send();
    }

    try {
      let matches: MatchData[] | null = await this.matchRepo.findAllMatchesBySummonerPUUID(
        summoner!.puuid,
      );

      if (matches && matches.length === 0) {
        res.status(404).send();
      }

      const firstTenMatches = matches.slice(0, 10);

      res.status(200).json(firstTenMatches);
    } catch (error) {}
  };
}

new MatchRoute();

module.exports = router;
