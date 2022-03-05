const express = require("express");
const router = express.Router();

import { getSummonersByLeague } from "../../../Services/Http";

router.get("/:queueType/:queueMode", async (req, res) => {
  // challenger,gm, master
  let queueType = req.params.queueType;
  // 5v5 solo, flex, flex TT
  let queueMode = req.params.queueMode;

  let queueLeague = "";
  let queueModeDescription = "";

  if (queueType === "challenger") queueLeague = "challengerleagues";
  if (queueType === "grandmaster") queueLeague = "grandmasterleagues";
  if (queueType === "master") queueLeague = "masterleagues";

  if (queueMode === "rankedsolo") queueModeDescription = "RANKED_SOLO_5x5";
  if (queueMode === "flexsolo") queueModeDescription = "RANKED_FLEX_SR";
  if (queueMode === "flextt") queueModeDescription = "RANKED_FLEX_TT";

  try {
    const summoners = await getSummonersByLeague(queueLeague, queueModeDescription);

    if (summoners.length === 0) {
      return res.status(404).json({
        success: true,
        result: "No Summoners Found",
      });
    } else {
      res.status(200).json({
        success: true,
        result: summoners,
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
