const express = require("express");
const router = express.Router();

import { findSummonerByPUUID } from "../../../Repository/SummonerRepository";
import { formatSummonerForSending } from "../../../Services/FormatDocument";
import { getSummonerByName } from "../../../Services/Http";

router.get("/:name", async (req, res) => {
  if (req.params.name) {
    try {
      const Response = await getSummonerByName(req.params.name);

      // Search by PUUID and by Name to get 1 less requeset
      // let summonerInDB = await findSummonerByName(Response.data.name);
      let summonerInDB = await findSummonerByPUUID(Response.data.puuid);

      // if getSummonerByName/PUUID returns an entry add the summoner
      if (summonerInDB != null) {
        return res.status(200).json({
          success: true,
          result: formatSummonerForSending(summonerInDB),
        });
      }

      return res.status(404).json({
        success: true,
        result: "Summoner not Found",
      });
    } catch (error) {
      res.status(500);
      res.send("Error");
    }
  }
});

router.post("/", async (req, res) => {});

module.exports = router;
