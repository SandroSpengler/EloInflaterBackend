import axios from "axios";
import { Request, Response } from "express";
import { MatchData } from "../../../Models/Interfaces/MatchData";
import Summoner from "../../../Models/Interfaces/Summoner";
import { MatchRepository } from "../../../Repository/MatchRepository";
import { SummonerRepository } from "../../../Repository/SummonerRepository";
import { RiotGamesHttp } from "../../../Services/Http";
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

  public matchByName = async (req: Request, res: Response) => {
    let summonerName: string = req.params.name;
    let summoner: Summoner | null;

    if (!summonerName) {
      res.status(404).json({ success: false, message: "name not found" });
    }

    try {
      summoner = await this.summonerRepo.findSummonerByName(summonerName);

      if (summoner === null || summoner.puuid === undefined || summoner.puuid === "") {
        summoner = (await this.RGHttp.getSummonerByName(summonerName)).data;

        await this.summonerRepo.createSummoner(summoner);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          res.status(404).json({ success: false, result: "Summoner Not Found" });
        }
      } else {
        res.status(500).json({ success: false, result: "An Error has occurred please try again later" });
      }
    }

    try {
      let matches: MatchData[] | null = await this.matchRepo.findAllMatchesBySummonerPUUID(summoner!.puuid);

      if (matches && matches.length === 0) {
        res.status(404).json({ success: false, result: "No matches found" });
      }

      res.status(200).json({ success: true, result: matches });
    } catch (error) {}
  };
}

new MatchRoute();

module.exports = router;
