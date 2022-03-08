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

      // if (summonerInDB.updatedAt! < new Date().getTime() - 3600 * 1000) {
      if (summonerInDB.updatedAt! < new Date().getTime()) {
        // Refresh Summoner Data

        // Check if there are new matches for this summoner

        const latestMachList = await getMatchesBySummonerPUUID(Response.data.puuid);

        // Compares the latest 100 MatchIds for the Summoner with the already saved matchIds
        const newMatchesList: String[] = latestMachList.data.filter(
          (latestMatchId) =>
            // ! = means the match is not in the array
            !summonerInDB?.matchList.some(({ matchId: summonerMatchId }) => latestMatchId === summonerMatchId)
        );

        for (let i = 0; i < newMatchesList.length; i++) {
          const match = await getMatchByMatchId(newMatchesList[i]);

          // check if exhaust/tabis was abused

          // Maybe add more Properties to the Match
          let summonerMatch: IMatchSchema = {
            matchId: newMatchesList[i],
            exhaustAbused: false,
            tabisAbused: false,
          };

          // Add match to summoner
          summonerInDB.matchList.push(summonerMatch);
        }

        await updateSummoner(summonerInDB);
        await setUpdateSummonerDate(summonerInDB.puuid);

        // take MongodbProperties away
        let summonerToSend = formatSummonerForSending(summonerInDB);

        return res.status(200).json({
          success: true,
          result: summonerToSend,
        });
      }

      res.status(409).json({
        success: false,
        result: "Summoner already been updated within the last hour",
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
