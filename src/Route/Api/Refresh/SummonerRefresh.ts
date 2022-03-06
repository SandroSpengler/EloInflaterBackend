const express = require("express");
const router = express.Router();

import Summoner from "../../../Models/Interfaces/Summoner";
import { saveSummoner } from "../../../Repository/SummonerRepository";
import { getSummonerByName } from "../../../Services/Http";

router.get("/:name", async (req, res) => {
  if (req.params.name) {
    try {
      // Check if sommoner already exsists inside Mongodb
      const Reponse = await getSummonerByName(req.params.name);

      // Get SummonerData

      // Save Summoner to DB
      // const savedSummoner = await saveSummoner(Reponse.data);

      // console.log(savedSummoner.createdAt);
      // console.log(savedSummoner.updatedAt);

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

module.exports = router;
