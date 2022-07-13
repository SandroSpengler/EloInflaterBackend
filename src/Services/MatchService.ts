import { MatchData, Participant } from "../Models/Interfaces/MatchData";
import Summoner from "../Models/Interfaces/Summoner";
import { matchEvaluation } from "../Models/Types/MatchTypes";
import { MatchRepository } from "../Repository/MatchRepository";
import { RiotGamesHttp } from "./Http";

export class MatchService {
  private matchRepo: MatchRepository;
  private RGHttp: RiotGamesHttp;

  constructor(matchRepository: MatchRepository, RGHttp: RiotGamesHttp) {
    this.matchRepo = matchRepository;
    this.RGHttp = RGHttp;
  }

  public addRecentMatchesForSummoner = async (summonerPUUID: string) => {
    try {
      const sumonerMatches = await this.matchRepo.findAllMatchesBySummonerPUUID(summonerPUUID);

      const recentMatches = await this.RGHttp.getMatchesIdsBySummonerpuuid(summonerPUUID);
    } catch (error) {}
  };

  /**
   * Checks if the Summoner in that Match was inflated
   *
   * @param match The Match to be check on
   * @param summonerPUUID The ID of the Summoner to check for
   *
   * @returns The Evaluation that determines if the summoner is inflated
   */
  public checkSummonerInMatchForEloInflation = (match: MatchData, summonerPUUID: string): matchEvaluation => {
    if (match === undefined || summonerPUUID === undefined) throw new Error("Parameters not properly provided");

    try {
      let exhaustCount: number = 0;
      let exhaustCastCount: number = 0;
      let tabisCount: number = 0;
      let zhonaysCount: number = 0;

      let participantByPUUID: Participant = match.info[0].participants.find((participantByPUUID) => {
        return participantByPUUID.puuid === summonerPUUID;
      });

      if (participantByPUUID.summoner1Id === 3) {
        exhaustCount += 1;
        exhaustCastCount += participantByPUUID.summoner1Casts;
      }

      if (participantByPUUID?.summoner2Id === 3) {
        // summonerMatchDetails.exhaustAbused = true;
        exhaustCount += 1;
        exhaustCastCount += participantByPUUID.summoner2Casts;
      }
      // Items === Tabis (Id: 3047)
      // Items === Zhonay's (Id: 3157)
      if (participantByPUUID?.item0 === 3047) {
        tabisCount += 1;
      }
      if (participantByPUUID?.item0 === 3157) {
        zhonaysCount += 1;
      }
      if (participantByPUUID?.item1 === 3047) {
        tabisCount += 1;
      }
      if (participantByPUUID?.item1 === 3157) {
        zhonaysCount += 1;
      }
      if (participantByPUUID?.item2 === 3047) {
        tabisCount += 1;
      }
      if (participantByPUUID?.item2 === 3157) {
        zhonaysCount += 1;
      }
      if (participantByPUUID?.item3 === 3047) {
        tabisCount += 1;
      }
      if (participantByPUUID?.item3 === 3157) {
        zhonaysCount += 1;
      }
      if (participantByPUUID?.item4 === 3047) {
        tabisCount += 1;
      }
      if (participantByPUUID?.item4 === 3157) {
        zhonaysCount += 1;
      }
      if (participantByPUUID?.item5 === 3047) {
        tabisCount += 1;
      }
      if (participantByPUUID?.item5 === 3157) {
        zhonaysCount += 1;
      }
      if (participantByPUUID?.item6 === 3047) {
        tabisCount += 1;
      }
      if (participantByPUUID?.item6 === 3157) {
        zhonaysCount += 1;
      }

      if (exhaustCount < 0 || exhaustCastCount < 0 || tabisCount < 0 || zhonaysCount < 0) {
        const evaluation: matchEvaluation = {
          inflated: true,
          exhaustCount: exhaustCount,
          exhaustCastCount: exhaustCastCount,
          tabisCount: tabisCount,
          zhonaysCount: zhonaysCount,
        };
        return evaluation;
      }

      const evaluation: matchEvaluation = {
        inflated: false,
        exhaustCount: exhaustCount,
        exhaustCastCount: exhaustCastCount,
        tabisCount: tabisCount,
        zhonaysCount: zhonaysCount,
      };
      return evaluation;
    } catch (error) {
      throw error;
    }
  };
}
