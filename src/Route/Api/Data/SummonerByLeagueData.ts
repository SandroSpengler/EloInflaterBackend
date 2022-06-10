const express = require("express");
const router = express.Router();

export class SummonerByLeagueRoute {
  constructor() {
    router.get("/:rankSolo/:queueType", this.byRankSoloAndQueueType);
  }

  public byRankSoloAndQueueType = async (req, res) => {
    // challenger,gm, master
    let rank = req.params.rankSolo.toUpperCase();
    // 5v5 solo, flex, flex TT
    let queueType = req.params.queueType.toUpperCase();

    try {
      // const summoners = await findAllSummonersByRank(rank);
      const summoners: any = {};

      if (summoners != null && summoners!.length > 0) {
        summoners.sort((summonerA, summonerB) => {
          return summonerA.leaguePoints! > summonerB.leaguePoints! ? -1 : 1;
        });

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
  };
}

new SummonerByLeagueRoute();

module.exports = router;
