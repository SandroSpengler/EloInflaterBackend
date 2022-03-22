import { Request, Response } from "express";
import { MatchData } from "../../../Models/Interfaces/MatchData";
import { findAllMatchesBySummonerPUUID } from "../../../Repository/MatchRepository";

const express = require("express");
const router = express.Router();

router.get("/:name", async (req: Request, res: Response) => {
  let summonerName: string = req.params.name;

  if (!summonerName) {
    res.status(404).json({ success: false, message: "name not found" });
  }

  try {
    let match: MatchData[] | null = await findAllMatchesBySummonerPUUID("");

    res.status(200).json({ success: true, result: match });
  } catch (error) {}
});

module.exports = router;
