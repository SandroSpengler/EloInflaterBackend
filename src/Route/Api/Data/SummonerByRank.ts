import { SbLTier } from "../../../Models/Types/SummonerByLeagueTypes";
import { SummonerRepository } from "../../../Repository/SummonerRepository";

const express = require("express");
const router = express.Router();

export class SummonerByLeagueRoute {
  private SbLRepo: SummonerRepository = new SummonerRepository();

  constructor() {
    router.get("/:rankSolo/:queueType", this.byRankSoloAndQueueType);
  }

  /**
   * @openapi
   * /api/data/league/{queueType}/{rankSolo}:
   *  get:
   *    produces:
   *      - application/json
   *    tags:
   *      - SummonerByLeague
   *    parameters:
   *      - in: path
   *        name: queueType
   *        required: true
   *        type: string
   *      - in: path
   *        name: rankSolo
   *        required: true
   *        type: string
   *        description: Values - CHALLENGER, GRANDMASTER, MASTER
   *    description: Returns all Summoners matching queue and rank
   *    responses:
   *      200:
   *        $ref: '#/components/responses/SuccesMultipleSummoner'
   *      400:
   *         $ref: '#/components/responses/BadRequest'
   *      404:
   *         $ref: '#/components/responses/NotFound'
   *      429:
   *         $ref: '#/components/responses/TooManyRequests'
   *      500:
   *         $ref: '#/components/responses/InternalServerError'
   */
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

      return res.status(404).send();
    } catch (error) {
      return res.status(500).send();
    }
  };
}

new SummonerByLeagueRoute();

module.exports = router;
