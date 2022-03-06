const express = require("express");
const router = express.Router();

import { resolveTxt } from "dns";
import Summoner from "../../../Models/Interfaces/Summoner";
import { findSummonerByPUUID, saveSummoner, updateSummoner } from "../../../Repository/SummonerRepository";
import { formatSummonerForSending } from "../../../Services/FormatDocument";
import { getSummonerByName } from "../../../Services/Http";

router.get("/byName/:name", async (req, res) => {
  if (req.params.name) {
    try {
      // Get Summoner Data
      const Reponse = await getSummonerByName(req.params.name);

      // Check if sommoner already exsists inside Mongodb
      let summonerInDB = await findSummonerByPUUID(Reponse.data.puuid);

      if (summonerInDB == null) {
        // If it does save Summoner to DB
        summonerInDB = await saveSummoner(Reponse.data);
      }

      console.log(summonerInDB.updatedAt);

      // Check if Summoner was updated within the last 60 Minutes?
      // console.log(new Date().getTime() - 3600 * 1000);
      if (summonerInDB.updatedAt! < new Date().getTime() - 3600 * 1000) {
        // Refresh Summoner Data
        updateSummoner(summonerInDB.puuid);
        console.log("update!");
      }

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

module.exports = router;
