import { SbLTier } from "../../../Models/Types/SummonerByLeagueTypes";
import { SummonerRepository } from "../../../Repository/SummonerRepository";

const express = require("express");
const router = express.Router();

export class SummonerByLeagueRoute {
  private SbLRepo: SummonerRepository = new SummonerRepository();

  constructor() {
    router.get("/:rankSolo/:queueType", this.byRankSoloAndQueueType);
  }

  public byRankSoloAndQueueType = async (req, res) => {
    let rank: SbLTier = req.params.rankSolo.toUpperCase();

    if (!["CHALLENGER", "GRANDMASTER", "MASTER"].includes(rank)) {
      return res.status(400).send();
    }

    try {
      const summoners = await this.SbLRepo.findAllSummonersByRank(rank);

      if (summoners != null && summoners!.length > 0) {
        summoners.sort((summonerA, summonerB) => {
          return summonerA.leaguePoints! > summonerB.leaguePoints! ? -1 : 1;
        });

        return res.status(200).json(summoners);
      }

      return res.status(404).json({
        success: true,
        result: `no summoners found for rank ${rank}`,
        error: null,
      });
    } catch (error) {
      return res.status(500).send();
    }
  };
}

new SummonerByLeagueRoute();

module.exports = router;
