import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
import Summoner from "../../../Models/Interfaces/Summoner";
import { SummonerResponse } from "../../../Models/Types/ApiTypes";
import { SummonerRepository } from "../../../Repository/SummonerRepository";
import { formatSummonerForSending } from "../../../Services/FormatDocument";
import { RiotGamesHttp } from "../../../Services/Http";
import { SummonerService } from "../../../Services/SummonerService";

const express = require("express");
const router = express.Router();

export class SummonerData {
  private RGHttp: RiotGamesHttp = new RiotGamesHttp();

  private summonerRepo: SummonerRepository = new SummonerRepository();
  private summonerService: SummonerService = new SummonerService(this.summonerRepo, this.RGHttp);

  constructor() {
    router.get("/", this.getAllSummoner);
    router.get("/:name", this.getSummonerByName);
  }

  public getAllSummoner = async (req, res) => {
    if (process.env.NODE_ENV && process.env.NODE_ENV == "development") {
      const allSummoners = await this.summonerRepo.findAllSummoners();

      return res.status(200).json({ allSummoners });
    }
    return res.status(409).json({
      success: false,
      result: null,
      error: "Endpoint no longer exists",
    });
  };

  /**
   * Finds the SummonerByName
   *
   * @param req HTTP-Request
   * @param res HTTP-Response
   *
   * @returns HTTP-Response
   */
  public getSummonerByName = async (req: Request, res: Response) => {
    if (req.params.name === undefined || req.params.name === "") {
      return res.status(400).json({
        success: false,
        result: null,
        erorr: "No SummonerName was provided",
      });
    }

    try {
      let queryName = req.params.name;

      // Search by PUUID and by Name to get 1 less requeset

      let summonerInDB = await this.summonerRepo.findSummonerByName(req.params.name);

      // if getSummonerByName/PUUID returns an entry add the summoner
      if (summonerInDB != null) {
        return res.status(200).json({
          success: true,
          result: formatSummonerForSending(summonerInDB),
          error: null,
        });
      } else {
        let getsummonerBynameResponse = await this.RGHttp.getSummonerByName(queryName);

        if (getsummonerBynameResponse.status === 200) {
          await this.summonerRepo.createSummoner(getsummonerBynameResponse.data);

          return res.status(280).json({
            success: true,
            result: formatSummonerForSending(getsummonerBynameResponse.data),
            error: null,
          });
        }
      }

      return res.status(404).json({
        success: true,
        result: "Summoner not found",
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

new SummonerData();

module.exports = router;
