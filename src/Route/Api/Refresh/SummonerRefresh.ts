const express = require("express");
const router = express.Router();

import { Request, response, Response } from "express";
import { IMatchSchema } from "../../../Models/Interfaces/MatchList";
import {
  findSummonerByLeague,
  findSummonerByPUUID,
  saveSummoner,
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
  if (req.params.name) {
    try {
      // Get Summoner Data
      const Response = await getSummonerByName(req.params.name);

      // Check if sommoner already exsists inside Mongodb
      let summonerInDB = await findSummonerByPUUID(Response.data.puuid);

      if (summonerInDB == null) {
        // Get matchIds for this summoner
        // If it does save Summoner to DB
        summonerInDB = await saveSummoner(Response.data);
      }

      // Check if Summoner was updated within the last 60 Minutes?
      // console.log(new Date().getTime() - 3600 * 1000);
      if (summonerInDB.updatedAt! < new Date().getTime() - 3600 * 1000) {
        // Refresh Summoner Data
        setUpdateSummonerDate(summonerInDB.puuid);
      }

      // Check if there are new matches for this summoner
      const match = await getMatchByMatchId("EUW1_5765699139");
      const matchList = await getMatchesBySummonerPUUID(Response.data.puuid);

      let summonerMatchExample: IMatchSchema = {
        matchId: "123",
        exhaustAbused: false,
        tabisAbused: false,
      };

      let summonerMatchExampleList: IMatchSchema[] = [];

      summonerMatchExampleList.push(summonerMatchExample);

      // summonerInDB.matchList.push(...summonerMatchExampleList);

      await updateSummoner(summonerInDB);

      // take MongodbProperties away
      let summonerToSend = formatSummonerForSending(summonerInDB);

      res.status(200).json({
        success: true,
        result: summonerToSend,
      });
    } catch (error) {
      res.status(500);
      res.send("Error");
    }
  }
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
