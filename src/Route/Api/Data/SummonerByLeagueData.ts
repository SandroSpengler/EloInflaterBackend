const express = require("express");
const router = express.Router();

import { getSummonersByLeague } from "../../../Services/Http";

router.get("/:queueType/:queueMode", async (req, res) => {
  // challenger,gm, master
  let queueType = req.params.queueType;
  // 5v5 solo, flex, flex TT
  let queueMode = req.params.queueMode;

  try {
    const summoners = await getSummonersByLeague(queueType, queueMode);

    if (summoners.data.entries.length === 0) {
      return res.status(404).json({
        success: true,
        result: "No Summoners Found",
      });
    } else {
      res.status(200).json({
        success: true,
        result: summoners.data.entries,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      result: "Check provided Query Parameter",
    });
  }
});

router.post("/", async (req, res) => {});

module.exports = router;
