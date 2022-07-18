import axios from "axios";
import { MatchData } from "../Models/Interfaces/MatchData";
import Summoner from "../Models/Interfaces/Summoner";
import { MatchRepository } from "../Repository/MatchRepository";
import { SummonerRepository } from "../Repository/SummonerRepository";
import { RiotGamesHttp } from "./Http";
import { MatchService } from "./MatchService";
import { SummonerService } from "./SummonerService";

export class DataMiningService {
  private summonerRepo: SummonerRepository;
  // private summonerService: SummonerService;

  private matchRepo: MatchRepository;
  private matchService: MatchService;

  private RGHttp: RiotGamesHttp;

  constructor(
    summonerRepo: SummonerRepository,
    // summonerService: SummonerService,
    RGHttp: RiotGamesHttp,
    matchRepo: MatchRepository,
    matchService: MatchService,
  ) {
    this.RGHttp = RGHttp;
    this.summonerRepo = summonerRepo;
    // this.summonerService = summonerService;

    this.matchRepo = matchRepo;
    this.matchService = matchService;
  }

  /**
   * Requests new Matches for Summoner and adds them
   *
   * @param summoner Summoner that new matches should be added for
   *
   * @void
   */
  addNewMatchesToSummoner = async (summoner: Summoner) => {
    try {
      const matchResponse = await this.RGHttp.getMatchesIdsBySummonerpuuid(summoner.puuid);

      const matchesForSummoner = await matchResponse.data;

      await this.addUnassignedMatchesToSummoner(summoner);

      const newMatchIdsForSummoner = matchesForSummoner.filter((matchId) => {
        let checkUninflated = summoner.uninflatedMatchList.find((summonerMatchId) => summonerMatchId === matchId);

        let checkinflated = summoner.inflatedMatchList.find((summonerMatchId) => summonerMatchId === matchId);

        // assinged matches can be returned here
        if (checkUninflated || checkinflated) return;

        return matchId;
      });

      if (newMatchIdsForSummoner.length === 0) {
        let currentTime = new Date().getTime();
        summoner.lastMatchUpdate = currentTime;

        await this.summonerRepo.updateSummonerByPUUID(summoner);

        return;
      }

      for (let [index, matchId] of newMatchIdsForSummoner.entries()) {
        console.log(`Adding Match ${index} of ${newMatchIdsForSummoner.length}`);
        const matchInDB = await this.matchRepo.findMatchById(matchId);

        if (matchInDB === null) {
          try {
            const matchData = (await this.RGHttp.getMatchByMatchId(matchId)).data;
            await this.matchRepo.createMatch(matchData);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 404) {
                continue;
              } else {
                throw error;
              }
            }
          }
        }
      }
      let currentTime = new Date().getTime();
      summoner.lastMatchUpdate = currentTime;
    } catch (error) {
      throw error;
    } finally {
      await this.addUnassignedMatchesToSummoner(summoner);
    }
  };

  /**
   * Finds all Matches in DB for a summoner and adds them to the Summoner.Matchlists
   *
   * @param summoner The Summoner that should be checked for
   *
   * @void
   */
  addUnassignedMatchesToSummoner = async (summoner: Summoner) => {
    if (summoner === undefined || summoner === null) throw new Error("No Summoner was provided");
    if (summoner.puuid === undefined) throw new Error(`Summoner ${summoner.name} does not have a PUUID`);

    try {
      const matchesBySummonerPUUID = await this.matchRepo.findAllMatchesBySummonerPUUID(summoner.puuid);

      if (matchesBySummonerPUUID?.length === 0) return;

      const unassingedMatches = matchesBySummonerPUUID.filter((match) => {
        let checkUninflated = summoner.uninflatedMatchList.find((summonerMatchId) => summonerMatchId === match._id);

        let checkinflated = summoner.inflatedMatchList.find((summonerMatchId) => summonerMatchId === match._id);

        // assinged matches can be returned here
        if (checkUninflated || checkinflated) return;

        return match;
      });

      if (unassingedMatches.length === 0) {
        return;
      }

      for (let match of unassingedMatches) {
        const matchEvaluation = this.matchService.checkSummonerInMatchForEloInflation(match, summoner.puuid);

        if (matchEvaluation.inflated) {
          summoner.inflatedMatchList.push(match._id);

          summoner.exhaustCount += matchEvaluation.exhaustCount;
          summoner.exhaustCastCount += matchEvaluation.exhaustCastCount;
          summoner.tabisCount += matchEvaluation.tabisCount;
          summoner.zhonaysCount += matchEvaluation.zhonaysCount;
        } else {
          summoner.uninflatedMatchList.push(match._id);
        }
      }

      await this.summonerRepo.updateSummonerByPUUID(summoner);
    } catch (error) {
      throw error;
    }
  };
}
