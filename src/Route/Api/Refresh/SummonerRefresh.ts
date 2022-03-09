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
} from "../../../Repository/SummonerRepository";
import { formatSummonerByLeagueForSending, formatSummonerForSending } from "../../../Services/FormatDocument";
import {
  getMatchByMatchId,
  getMatchesBySummonerPUUID,
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

  // Get matchIds for this summoner

  let summonerInDB: Summoner = await createSummoner(summonerByNameApiReponse.data);

  // Check if Summoner was updated within the last 60 Minutes Or just created?

  // if (summonerInDB.updatedAt! < new Date().getTime() - 3600 * 1000) {
  if (!checkIfSummonerCanBeUpdated(summonerInDB)) {
    res.status(409).json({
      success: false,
      result: "Summoner already been updated within the last hour",
    });
  }

  // Refresh Summoner Data

  // Check if there are new matches for this summoner

  // update Summoner Matches --

  // --

  // take MongodbProperties away
  let summonerToSend = formatSummonerForSending(summonerInDB);

  return res.status(200).json({
    success: true,
    result: "Summoner Updated",
  });

  // if (axios.isAxiosError(error)) {
  //   if (error.response?.status === 429) {
  //   }
  // }
  res.status(500).json({ success: false, RequestError: "not working" });
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
