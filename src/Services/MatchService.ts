import { MatchData, Participant } from "../Models/Interfaces/MatchData";
import Summoner from "../Models/Interfaces/Summoner";
import { MatchRepository } from "../Repository/MatchRepository";

export class MatchService {
  private matchRepo: MatchRepository;

  constructor(matchRepository: MatchRepository) {
    this.matchRepo = matchRepository;
  }

  /**
   * Checks all matches of a summoner and Looks for Inflated Items/Summoners
   *
   * @void
   */
  public checkSummonerMatchesForEloInflation = async (summoner: Summoner) => {
    try {
      if (summoner.matchList === undefined) return;

      let summonerMatches: MatchData[] | null = [];

      for (let matchId of summoner.matchList) {
        let detailedMatch = await this.matchRepo.findMatchById(matchId);

        if (detailedMatch) {
          summonerMatches.push(detailedMatch);
        }
      }

      if (summonerMatches === null || summonerMatches.length === 0) return;

      let exhaustCount: number = 0;
      let exhaustCastCount: number = 0;
      let tabisCount: number = 0;
      let zhonaysCount: number = 0;

      if (summonerMatches === undefined) return;

      let matchesForSummonerPUUID: Participant[] = [];

      for (const [index, match] of summonerMatches.entries()) {
        let summonerMatch: Participant | undefined = match.info[0].participants.find((participant) => {
          return participant.puuid === summoner?.puuid;
        });

        if (summonerMatch === undefined) {
          continue;
        }

        matchesForSummonerPUUID.push(summonerMatch);
      }

      for (let participant of matchesForSummonerPUUID) {
        if (participant?.summoner1Id === 3) {
          // summonerMatchDetails.exhaustAbused = true;

          exhaustCount += 1;
          exhaustCastCount += participant.summoner1Casts;
        }

        if (participant?.summoner2Id === 3) {
          // summonerMatchDetails.exhaustAbused = true;

          exhaustCount += 1;
          exhaustCastCount += participant.summoner2Casts;
        }

        // Items === Tabis (Id: 3047)
        // Items === Zhonay's (Id: 3157)

        if (participant?.item0 === 3047) {
          tabisCount += 1;
        }
        if (participant?.item0 === 3157) {
          zhonaysCount += 1;
        }

        if (participant?.item1 === 3047) {
          tabisCount += 1;
        }
        if (participant?.item1 === 3157) {
          zhonaysCount += 1;
        }

        if (participant?.item2 === 3047) {
          tabisCount += 1;
        }
        if (participant?.item2 === 3157) {
          zhonaysCount += 1;
        }

        if (participant?.item3 === 3047) {
          tabisCount += 1;
        }
        if (participant?.item3 === 3157) {
          zhonaysCount += 1;
        }

        if (participant?.item4 === 3047) {
          tabisCount += 1;
        }
        if (participant?.item4 === 3157) {
          zhonaysCount += 1;
        }

        if (participant?.item5 === 3047) {
          tabisCount += 1;
        }
        if (participant?.item5 === 3157) {
          zhonaysCount += 1;
        }

        if (participant?.item6 === 3047) {
          tabisCount += 1;
        }
        if (participant?.item6 === 3157) {
          zhonaysCount += 1;
        }
      }

      // summoner.matchCount = summonerMatches.length;
      summoner.exhaustCount = exhaustCount;
      summoner.exhaustCastCount = exhaustCastCount;
      summoner.tabisCount = tabisCount;
      summoner.zhonaysCount = zhonaysCount;

      // await updateSummonerByPUUID(summoner);

      return;

      // await setexhaustCount(exhaustCount);
      // await setexhastCastedCount(exhaustUsedCount);
      // await setTabisCount(tabisCount);
      // await setzhonaysCount(zhonaysCount);
    } catch (error) {
      throw error;
    }
  };
}
