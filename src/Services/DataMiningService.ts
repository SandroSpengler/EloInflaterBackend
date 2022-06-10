import Summoner from "../Models/Interfaces/Summoner";
import { MatchRepository } from "../Repository/MatchRepository";
import { SummonerRepository } from "../Repository/SummonerRepository";
import { RiotGamesHttp } from "./Http";
import { MatchService } from "./MatchService";
import { SummonerService } from "./SummonerService";

export class DataMiningService {
  private summonerRepo: SummonerRepository;
  private summonerService: SummonerService;

  private matchRepo: MatchRepository;
  private matchService: MatchService;

  private RGHttp: RiotGamesHttp;

  constructor(
    summonerRepo: SummonerRepository,
    summonerService: SummonerService,
    RGHttp: RiotGamesHttp,
    matchRepo: MatchRepository,
    matchService: MatchService,
  ) {
    this.summonerRepo = summonerRepo;
    this.summonerService = summonerService;

    this.matchRepo = matchRepo;
    this.matchService = matchService;

    this.RGHttp = RGHttp;
  }

  checkForNewSummonerMatches = async (updateType: string) => {
    console.log("3. Checking Matches in Queue " + updateType);
    let queuedSummoners: Summoner[] | null = [];

    try {
      queuedSummoners = await this.summonerRepo.findAllSummonersByRank(updateType);

      if (queuedSummoners === null || queuedSummoners.length === 0) return;

      for (let [index, summoner] of queuedSummoners.entries()) {
        console.log(`3. Getting Matches for ${summoner.name}: ${updateType} index: ${index}`);

        try {
          if (summoner.puuid === "" || summoner.puuid === undefined) {
            summoner.puuid = (await this.RGHttp.getSummonerBySummonerId(summoner._id)).data.puuid;
            await this.summonerRepo.updateSummonerBySummonerID(summoner);
          }
        } catch (error) {
          break;
        }

        try {
          let unixTimeStamp = new Date().getTime() - 3600 * 96 * 1000;
          if (summoner.lastMatchUpdate! !== undefined && unixTimeStamp < summoner.lastMatchUpdate!) {
            console.log(`3. Summoner ${summoner.name} already checked recently`);

            continue;
          }
        } catch (error) {}

        // Update Summoner Matches
        try {
          // Check what matches arent already in summoner

          let newMatchIds: string[] = (await this.RGHttp.getMatchesIdsBySummonerpuuid(summoner.puuid)).data;
          summoner.lastMatchUpdate = new Date().getTime();
          await this.summonerRepo.updateSummonerBySummonerID(summoner);

          if (newMatchIds === undefined || newMatchIds === null || newMatchIds.length === 0) continue;

          let matchesToUpdate: string[] = [];

          for (const newMatchId of newMatchIds) {
            let exsistingMatch = await this.matchRepo.findMatchById(newMatchId);

            if (exsistingMatch != null && exsistingMatch === undefined) {
              matchesToUpdate.push(newMatchId);
            }
          }

          if (matchesToUpdate === undefined || matchesToUpdate.length === 0) continue;

          for (const [index, matchid] of matchesToUpdate.entries()) {
            let summonerMatchDetails = (await this.RGHttp.getMatchByMatchId(matchid)).data;

            await this.matchRepo.createMatch(summonerMatchDetails);

            summoner.matchList?.push(matchid);

            await this.summonerRepo.updateSummonerBySummonerID(summoner);

            console.log(`3. Added Match for ${summoner.name} at index: ${index}`);
          }

          await this.matchService.checkSummonerMatchesForEloInflation(summoner);
        } catch (error: any) {
          console.log(error.message);
          break;
        }
      }

      // GET Summoners that need updating from db
      // Search Summoners for summoners that need updating
      // await updatSummonerMatches()
    } catch (error) {
      throw error;
    } finally {
      console.log("3. Finished searching for matches ");
    }
  };

  updatSummonerMatches = async (summoner: Summoner) => {
    console.log("updating summoner");

    try {
      // Check what matches arent already in summoner

      let newMatchIds: string[] = (await this.RGHttp.getMatchesIdsBySummonerpuuid(summoner.puuid)).data;
      summoner.lastMatchUpdate = new Date().getTime();
      await this.summonerRepo.updateSummonerBySummonerID(summoner);

      if (newMatchIds === undefined || newMatchIds === null || newMatchIds.length === 0) return;

      let matchesToUpdate: string[] = [];

      for (const newMatchId of newMatchIds) {
        let exsistingMatch = await this.matchRepo.findMatchById(newMatchId);

        if (exsistingMatch != null && exsistingMatch === undefined) {
          matchesToUpdate.push(newMatchId);
        }
      }

      if (matchesToUpdate === undefined || matchesToUpdate.length === 0) return;

      for (const [index, matchid] of matchesToUpdate.entries()) {
        let summonerMatchDetails = (await this.RGHttp.getMatchByMatchId(matchid)).data;

        await this.matchRepo.createMatch(summonerMatchDetails);

        summoner.matchList?.push(matchid);

        await this.summonerRepo.updateSummonerBySummonerID(summoner);

        console.log(`3. Added Match for ${summoner.name} at index: ${index}`);
      }
    } catch (error: any) {
      console.log(error.message);
      throw error;
    } finally {
      await this.matchService.checkSummonerMatchesForEloInflation(summoner);
    }
  };

  checkSummonerMatchIdLists = async () => {
    try {
      let allSummoners = await this.summonerRepo.findAllSummoners();

      let summonerToCheck = allSummoners?.filter(
        (summoner) => summoner.matchList === undefined || summoner.matchList.length === 0,
      );

      for (let [index, summoner] of summonerToCheck!.entries()) {
        console.log(`Updating Summoner ${summoner.name} at index ${index} of ${summonerToCheck?.length}`);

        let matchesInDB = await this.matchRepo.findAllMatchesBySummonerPUUID(summoner.puuid);

        summoner.matchList = [];

        for (let match of matchesInDB!) {
          summoner.matchList?.push(match._id.toString());
        }

        await this.summonerRepo.updateSummonerByPUUID(summoner);
      }

      console.log(summonerToCheck);
    } catch (error) {
      throw error;
    }
  };
}
