const express = require("express");
const router = express.Router();

import { createSummoner, findSummonerByName, findSummonerByPUUID } from "../../../Repository/SummonerRepository";
import { formatSummonerForSending } from "../../../Services/FormatDocument";
import { getSummonerByName } from "../../../Services/Http";

router.get("/:name", async (req, res) => {
  if (req.params.name) {
    try {
      // Search by PUUID and by Name to get 1 less requeset
      // let summonerInDB = await findSummonerByName(Response.data.name);
      let summonerInDB = await findSummonerByName(req.params.name);

      // if getSummonerByName/PUUID returns an entry add the summoner
      if (summonerInDB != null) {
        return res.status(200).json({
          success: true,
          result: formatSummonerForSending(summonerInDB),
        });
      } else {
        let getsummonerBynameResponse = await getSummonerByName(req.params.name);

        if (getsummonerBynameResponse.status === 200) {
          await createSummoner(getsummonerBynameResponse.data);

          return res.status(280).json({
            success: true,
            result: formatSummonerForSending(getsummonerBynameResponse.data),
          });
        }
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
