import { SummonerByLeagueRepository } from "../Repository/SummonerByLeagueRepository";
import { SummonerRepository } from "../Repository/SummonerRepository";
import Summoner from "../Models/Interfaces/Summoner";
import SummonerByLeague from "../Models/Interfaces/SummonerByLeague";
import { RiotGamesHttp } from "./Http";
import { SbLQueue, SbLTier } from "../Models/Types/SummonerByLeagueTypes";

/**
 * This Service provides operations on the SummonerByLeague collection
 *
 * @param SbLRepo The Repository for the SummonerByLeague collection
 * @param SummonerRepo The Repository for the Summoner collection
 * @param RGHttp The HTTP-Service for the RIOT-Games API enpoints
 *
 */
export class SummonerByLeagueService {
  public SbLRepo: SummonerByLeagueRepository;
  public SummonerRepo: SummonerRepository;
  public RGHttp: RiotGamesHttp;

  constructor(SbLRepo: SummonerByLeagueRepository, SummonerRepo: SummonerRepository, RGHttp: RiotGamesHttp) {
    this.SbLRepo = SbLRepo;
    this.SummonerRepo = SummonerRepo;
    this.RGHttp = RGHttp;
  }

  /**
   * Determines if the Collection in DB is outdated
   *
   * @param summonerByLeague SummonersByLeague that determine if updating is possible
   *
   * @returns Boolean which states if collection can be updated
   */
  checkIfSummonersByLeagueCanBeUpdated = (summonerByLeague: SummonerByLeague): boolean => {
    let unixTimeStamp = new Date().getTime() - 240 * 1000;

    if (summonerByLeague === undefined) return false;
    if (summonerByLeague.updatedAt === undefined) return false;

    if (summonerByLeague.updatedAt! < unixTimeStamp) return true;

    return false;
  };

  /**
   * Not yet tested
   * Update Summoner information in DB
   *
   *
   * @param tier
   * @returns
   */
  validateSummonerIds = async (tier: SbLTier) => {
    console.log("1. Checking Summoners Ids in queue: " + tier);

    // current rank of top summoners
    let summonerByLeague: SummonerByLeague | null = await this.SbLRepo.findSummonerByLeague(tier, "RANKED_SOLO_5x5");

    if (!summonerByLeague) return;

    // Check if summonerByLeague are newer than 24 hours

    // summoner as saved in db
    let summonerList: Summoner[] | null = await this.SummonerRepo.findAllSummonersByRank(tier);

    if (!summonerList) return;

    // const oldSummoners = summonerList?.find((summonerInDB) => {
    //   summonerByLeague?.entries.some((currentSummoner) => currentSummoner.summonerName == summonerInDB.name);
    // });

    // Check summonerDB entry is update to date with current league

    // for (let i = 0; i < summonerList.length; i++) {

    for (let [index, summoner] of summonerList.entries()) {
      // Get Summoner PUUID

      try {
        if (summoner.puuid === undefined || summoner.puuid === "") {
          let summonerInfo;
          try {
            summonerInfo = (await this.RGHttp.getSummonerBySummonerId(summoner.summonerId)).data;
          } catch (error) {
            break;
          }

          let summonerToSave = summoner;

          summonerToSave.accountId = summonerInfo.accountId;
          summonerToSave.puuid = summonerInfo.puuid;
          summonerToSave.profileIconId = summonerInfo.profileIconId;
          summonerToSave.revisionDate = summonerInfo.revisionDate;
          summonerToSave.summonerLevel = summonerInfo.summonerLevel;

          await this.SummonerRepo.updateSummonerBySummonerID(summonerToSave);

          console.log(`validated ${summoner.name} in queue ${tier} at index ${index}`);
        }
      } catch (error) {
        break;
      }
    }
  };

  /**
   * Not yet Tested
   * This function looks for the current Summoners with the rank = SbL.queue and
   * updates them with the current information
   *
   *
   * @param tier
   * @returns
   */
  validateSummonerLeague = async (tier: SbLTier) => {
    console.log("2. validating summonersByLeague " + tier);
    // current rank of top summoners
    let summonerByLeague: SummonerByLeague | null = await this.SbLRepo.findSummonerByLeague(tier, "RANKED_SOLO_5x5");

    let summonerList: Summoner[] | null = await this.SummonerRepo.findAllSummonersByRank(tier);

    if (summonerByLeague === null || summonerByLeague === undefined) return;

    if (summonerList === null || summonerList === undefined) return;

    if (summonerByLeague.updatedAt! > new Date().getTime() - 3600 * 1000) {
      // update SummonerByLeague
      console.log("2. update SummonerByLeague");
    }

    let outDatedSummoners: Summoner[] = summonerList.filter((summoner) => {
      if (summoner.lastRankUpdate === undefined) return summoner;

      return summoner.lastRankUpdate! < summonerByLeague?.updatedAt!;
    });

    if (outDatedSummoners === undefined || outDatedSummoners === null || outDatedSummoners.length === 0) return;

    for (let [index, oldSummoner] of outDatedSummoners.entries()) {
      const currentSummonerInLeague = summonerByLeague.entries.find((currentSummoner) => {
        return currentSummoner.summonerId === oldSummoner._id;
      });

      console.log("updating index: " + index + ": " + currentSummonerInLeague?.summonerName);

      if (currentSummonerInLeague === undefined) {
        oldSummoner.rank = "";
        oldSummoner.rankSolo = "";
        oldSummoner.leaguePoints = 0;
        oldSummoner.lastRankUpdate = summonerByLeague.updatedAt;

        await this.SummonerRepo.updateSummonerByPUUID(oldSummoner);

        continue;
      }

      oldSummoner.rank = currentSummonerInLeague.rank;
      oldSummoner.wins = currentSummonerInLeague.wins;
      oldSummoner.losses = currentSummonerInLeague.losses;
      oldSummoner.leaguePoints = currentSummonerInLeague.leaguePoints;
      oldSummoner.lastRankUpdate = summonerByLeague.updatedAt;

      await this.SummonerRepo.updateSummonerByPUUID(oldSummoner);
      continue;
    }

    try {
    } catch (error) {
      console.log(error);
    }
  };
}
