const express = require("express");
const router = express.Router();

import { Summoner } from "../../../Models/Interfaces/Summoner";
import { saveSummoner } from "../../../Repository/SummonerRepository";
import { getSummonerByName } from "../../../Services/Http";

router.get("/:name", async (req, res) => {
  if (req.params.name) {
    try {
      // Check if sommoner already exsists

      // Get SummonerData
      const Reponse = await getSummonerByName(req.params.name);

      // Save Summoner to DB
      const savedSummoner: Summoner = await saveSummoner(Reponse.data);

      // Save Last Refresh time of that SummonerData

      res.status(200).json({
        success: true,
        result: Reponse.data,
      });
    } catch (error) {
      res.status(500);
      res.send("Error");
    }
  }
});
