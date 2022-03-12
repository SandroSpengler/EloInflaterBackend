const express = require("express");
const router = express.Router();

import axios, { Axios, AxiosResponse, AxiosError } from "axios";
import { Request, response, Response } from "express";
import { IMatchSchema } from "../../../Models/Interfaces/MatchList";
import Summoner from "../../../Models/Interfaces/Summoner";
import {
  checkIfSummonerCanBeUpdated,
  createSummoner,
  findSummonerByLeague,
  findSummonerByPUUID,
  saveSummonerByLeague,
  setUpdateSummonerDate,
  updateSummoner,
  updateSummonerByLeague,
  updatSummonerMatches,
} from "../../../Repository/SummonerRepository";
import { formatSummonerByLeagueForSending, formatSummonerForSending } from "../../../Services/FormatDocument";
import {
  getMatchByMatchId,
  getMatchesBySummonerpuuid,
  getSummonerByName,
  getSummonersByLeague,
} from "../../../Services/Http";

router.get("/byName/:name", async (req: Request, res: Response) => {
  let summonerByNameApiReponse;

  if (!req.params.name) return res.status(409).json({ success: false, result: "Check Summoner Name" });

  try {
    // Get Summoner Data
    summonerByNameApiReponse = await getSummonerByName(req.params.name);
  } catch (error: any) {
    return res.status(500).json({
      succes: false,
      result: error.message,
    });
  }

  let summonerInDB: Summoner = await createSummoner(summonerByNameApiReponse.data);

  // if (summonerInDB.updatedAt! < new Date().getTime() - 3600 * 1000) {
  if (!checkIfSummonerCanBeUpdated(summonerInDB)) {
    res.status(409).json({
      success: false,
      result: "Summoner already been updated within the last hour",
    });
  }

  // update Summoner Matches
  let updatedMatchCounter;

  try {
    updatedMatchCounter = await updatSummonerMatches(summonerInDB);
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

  return res.status(200).json({
    success: true,
    result: `${updatedMatchCounter} Matches Added`,
  });
});

router.get("/byQueue/:queueType/:queueMode", async (req: Request, res: Response) => {
  let queueType = req.params.queueType;
  let queueMode = req.params.queueMode;

  try {
    const Response = await getSummonersByLeague(queueType, queueMode);

    let summonerByLeagueInDB = await findSummonerByLeague(queueType);

    if (summonerByLeagueInDB == null) {
      // If it does save Summoner to DB
      summonerByLeagueInDB = await saveSummonerByLeague(Response.data);
    }

    if (summonerByLeagueInDB.updatedAt! < new Date().getTime() - 3600 * 1000) {
      // Refresh Summoner Data
      updateSummonerByLeague(queueType, Response.data.entries);
    }

    let summonerByLeagueToSend = formatSummonerByLeagueForSending(summonerByLeagueInDB);

    res.status(200).json({
      success: true,
      result: summonerByLeagueToSend,
    });
  } catch (error) {}
});

module.exports = router;
