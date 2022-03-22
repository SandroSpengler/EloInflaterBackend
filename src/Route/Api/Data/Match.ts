import axios from "axios";
import { Request, Response } from "express";
import { MatchData } from "../../../Models/Interfaces/MatchData";
import Summoner from "../../../Models/Interfaces/Summoner";
import { findAllMatchesBySummonerPUUID } from "../../../Repository/MatchRepository";
import { createSummoner, findSummonerByName } from "../../../Repository/SummonerRepository";
import { getSummonerByName } from "../../../Services/Http";

const express = require("express");
const router = express.Router();

router.get("/:name", async (req: Request, res: Response) => {
  let summonerName: string = req.params.name;
  let summoner: Summoner | null;

  if (!summonerName) {
    res.status(404).json({ success: false, message: "name not found" });
  }

  try {
    summoner = await findSummonerByName(summonerName);

    if (summoner === null || summoner.puuid === undefined || summoner.puuid === "") {
      summoner = (await getSummonerByName(summonerName)).data;

      await createSummoner(summoner);
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
    let matches: MatchData[] | null = await findAllMatchesBySummonerPUUID(summoner!.puuid);

    if (matches && matches.length === 0) {
      res.status(404).json({ success: false, result: "No matches found" });
    }

    res.status(200).json({ success: true, result: matches });
  } catch (error) {}
});

module.exports = router;
