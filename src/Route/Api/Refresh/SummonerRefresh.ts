const express = require("express");
const router = express.Router();

import { resolveTxt } from "dns";
import Summoner from "../../../Models/Interfaces/Summoner";
import { findSummonerByPUUID, saveSummoner } from "../../../Repository/SummonerRepository";
import { formatSummonerForSending } from "../../../Services/FormatDocument";
import { getSummonerByName } from "../../../Services/Http";

router.get("/:name", async (req, res) => {
  if (req.params.name) {
    try {
      // Get Summoner Data
      const Reponse = await getSummonerByName(req.params.name);

      // Check if sommoner already exsists inside Mongodb
      let SummonerInDB = await findSummonerByPUUID(Reponse.data.puuid);

      if (SummonerInDB == null) {
        // If it does save Summoner to DB
        SummonerInDB = await saveSummoner(Reponse.data);
      }

      console.log(await SummonerInDB.createdAt);
      console.log(await SummonerInDB.updatedAt);

      // Check if Summoner was updated within the last 60 Minutes?
      // if(SummonerInDB.updatedAt > XXX) {

      // Refresh Summoner Data

      // }

      // Save Last Refresh time of that SummonerData

      // take MongodbProperties away

      let summonerToSend = formatSummonerForSending(SummonerInDB);

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

module.exports = router;
