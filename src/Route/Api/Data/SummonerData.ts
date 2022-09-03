import axios, { AxiosError } from "axios";

import { Request, Response } from "express";

import { SummonerRepository } from "../../../Repository/SummonerRepository";

import { RiotGamesHttp } from "../../../Services/Http";
import { SummonerService } from "../../../Services/SummonerService";

import { formatSummonerForSending } from "../../../Services/FormatDocument";

const express = require("express");
const router = express.Router();

export class SummonerData {
  private route: string = "/api/data/summoner";
  private RGHttp: RiotGamesHttp = new RiotGamesHttp();

  private summonerRepo: SummonerRepository = new SummonerRepository();
  private summonerService: SummonerService = new SummonerService(this.summonerRepo, this.RGHttp);

  constructor() {
    router.get("/", this.getAllSummoner);
    router.get("/:name", this.getSummonerByName);
  }

  /**
   * @openapi
   * /api/data/summoner:
   *   get:
   *    tags:
   *      - Summoners
   *    description: Provides all Summoners in DB - disabled in Production
   *    responses:
   *      200:
   *        description: Returns a mysterious string.
   */
  public getAllSummoner = async (req, res) => {
    if (process.env.NODE_ENV && process.env.NODE_ENV == "development") {
      const allSummoners = await this.summonerRepo.findAllSummoners();

      return res.status(200).json({ allSummoners });
    }
    return res.status(409).send();
  };

  /**
   * @openapi
   * /api/data/summoner/{summonerName}:
   *   get:
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: summonerName
   *         required: true
   *         type: string
   *     description: Provides a specific Summoner by Name
   *     responses:
   *       200:
   *         description: The Requested Summoner
   *         content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Summoner'
   */
  public getSummonerByName = async (req: Request, res: Response) => {
    if (req.params.name === undefined || req.params.name === "") {
      return res.status(400).send();
    }

    try {
      let queryName = req.params.name;

      // Search by PUUID and by Name to get 1 less requeset

      let summonerInDB = await this.summonerRepo.findSummonerByName(req.params.name);

      // if getSummonerByName/PUUID returns an entry add the summoner
      if (summonerInDB != null) {
        return res.status(200).json(formatSummonerForSending(summonerInDB));
      } else {
        let getsummonerBynameResponse = await this.RGHttp.getSummonerByName(queryName);

        if (getsummonerBynameResponse.status === 200) {
          await this.summonerRepo.createSummoner(getsummonerBynameResponse.data);

          let summonerCreated = await this.summonerRepo.findSummonerByName(req.params.name);

          if (summonerCreated === null) throw new Error("Summoner could ne be created");

          return res.status(280).json(formatSummonerForSending(summonerCreated));
        }
      }

      return res.status(404).send();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        let axiosError: AxiosError = error;

        if (axiosError.response?.status === 404) {
          return res.status(404).send();
        }

        if (axiosError.response?.status === 429) {
          return res.status(429).send();
        }
      }

      return res.status(500).send();
    }
  };
}

new SummonerData();

module.exports = router;
