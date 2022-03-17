const express = require("express");
const router = express.Router();

import { findAllSummoners, findAllSummonersByRank, findSummonerByLeague } from "../../../Repository/SummonerRepository";
import { getSummonersByLeague } from "../../../Services/Http";

router.get("/:rankSolo/:queueType", async (req, res) => {
  // challenger,gm, master
  let rank = req.params.rankSolo.toUpperCase();
  // 5v5 solo, flex, flex TT
  let queueType = req.params.queueType.toUpperCase();

  try {
    const summoners = await findAllSummonersByRank(rank);

    if (summoners != null && summoners!.length > 0) {
      return res.status(200).json({
        success: true,
        result: summoners,
      });
    }

    return res.status(404).json({
      success: true,
      result: "No Summoners Found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: "Check provided Query Parameter",
    });
  }
});

router.post("/", async (req, res) => {});

module.exports = router;
