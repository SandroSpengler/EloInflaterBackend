import { SummonerRepository } from "../Repository/SummonerRepository";
import { MatchData, Participant } from "../Models/Interfaces/MatchData";
import { IMatchSchema } from "../Models/Interfaces/MatchList";
import Summoner from "../Models/Interfaces/Summoner";
import SummonerByLeague from "../Models/Interfaces/SummonerByLeague";
import { SummonerByLeagueService } from "./SummonerByLeagueService";

export class SummonerService {
  public summonerRepo: SummonerRepository;

  constructor(summonerRepo: SummonerRepository) {
    this.summonerRepo = summonerRepo;
  }

  /**
   *
   * @param summoner Summoner that should be checked for updateability
   *
   * @returns Boolean which states if summoner update is possible
   */
  checkIfSummonerCanBeUpdated = (summoner: Summoner): Boolean => {
    let unixTimeStamp = new Date().getTime() - 240 * 1000;

    if (summoner.lastMatchUpdate === undefined) return true;

    if (unixTimeStamp > summoner.lastMatchUpdate!) return true;

    return false;
  };

  checkIfSummonerAbusedMatch = (summoner: Summoner, match: MatchData): IMatchSchema => {
    let summonerMatchDetails: IMatchSchema = {
      matchId: match.metadata.matchId,
      exhaustAbused: false,
      tabisAbused: false,
    };

    try {
      let summonerParticipantDetails: Participant | undefined = match.info.participants.find(
        (participant) => participant.puuid === summoner.puuid,
      );

      // SummonerIds === Exhaust (Id:3)

      if (summonerParticipantDetails?.summoner1Id === 3) {
        summonerMatchDetails.exhaustAbused = true;
      }

      if (summonerParticipantDetails?.summoner2Id === 3) {
        summonerMatchDetails.exhaustAbused = true;
      }

      // Items === Tabis (Id: 3047)

      if (summonerParticipantDetails?.item0 === 3047) {
        summonerMatchDetails.tabisAbused = true;
        return summonerMatchDetails;
      }
      if (summonerParticipantDetails?.item1 === 3047) {
        summonerMatchDetails.tabisAbused = true;
        return summonerMatchDetails;
      }
      if (summonerParticipantDetails?.item2 === 3047) {
        summonerMatchDetails.tabisAbused = true;
        return summonerMatchDetails;
      }
      if (summonerParticipantDetails?.item3 === 3047) {
        summonerMatchDetails.tabisAbused = true;
        return summonerMatchDetails;
      }
      if (summonerParticipantDetails?.item4 === 3047) {
        summonerMatchDetails.tabisAbused = true;
        return summonerMatchDetails;
      }
      if (summonerParticipantDetails?.item5 === 3047) {
        summonerMatchDetails.tabisAbused = true;
        return summonerMatchDetails;
      }
      if (summonerParticipantDetails?.item6 === 3047) {
        summonerMatchDetails.tabisAbused = true;
        return summonerMatchDetails;
      }

      return summonerMatchDetails;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Updates/Creates all Summoners in DB based SbLCollection
   *
   * @param SbLInDB
   */
  updateSumonersLeague = async (SbLInDB: SummonerByLeague) => {
    // 1. Find all Summoners in DB based on SbLInDB.tier
    // 1.1 Check if SummonersInDB are still part of SbLInDB
    // 1.2 Update all SummonersInDB with current information from SbLInDB

    const summonersByRankSolo = await this.summonerRepo.findAllSummonersByRank(SbLInDB.tier);

    let outDatedSummoners: Summoner[] = [];

    if (summonersByRankSolo.length === 0) {
      throw new Error(`No Summoners found with rankSolo equal to ${SbLInDB.tier}`);
    }

    // All Summoners that are not CHALLENGER but rankSolo is CHALLENGER
    outDatedSummoners = summonersByRankSolo.filter((summoner) => {
      return !SbLInDB.entries.some((SbLSummoner) => summoner._id === SbLSummoner.summonerId);
    });

    // Reset rank for outdated ones
    for (let summoner of outDatedSummoners) {
      summoner.rankSolo = "";

      this.summonerRepo.updateSummonerBySummonerID(summoner);
    }

    // create or update current ones
    for (let summonerSbL of SbLInDB.entries) {
      let summoner = await this.summonerRepo.findSummonerByID(summonerSbL.summonerId);

      if (!summoner) {
        let summonerToSave: Summoner = {
          _id: summonerSbL.summonerId,
          id: summonerSbL.summonerId,
          summonerId: summonerSbL.summonerId,
          accountId: "",
          puuid: "",
          name: summonerSbL.summonerName,
          profileIconId: 0,
          revisionDate: 0,
          summonerLevel: 0,
          leaguePoints: summonerSbL.leaguePoints,
          rank: summonerSbL.rank,
          rankSolo: SbLInDB.tier,
          wins: summonerSbL.wins,
          losses: summonerSbL.losses,
          veteran: summonerSbL.veteran,
          inactive: summonerSbL.inactive,
          freshBlood: summonerSbL.freshBlood,
          hotStreak: summonerSbL.hotStreak,
          updatedAt: SbLInDB.updatedAt,
        };

        // Todo Add Flex and TT
        if (SbLInDB?.queue === "RANKED_SOLO_5x5") {
          summonerToSave.rankSolo = SbLInDB.tier;
        }

        try {
          await this.summonerRepo.createSummoner(summonerToSave);
        } catch (error) {
          console.log(error);
        }
      }

      if (summoner) {
        summoner.name = summonerSbL.summonerName;
        summoner.leaguePoints = summonerSbL.leaguePoints;
        summoner.rank = summonerSbL.rank;
        summoner.rankSolo = SbLInDB.tier;
        summoner.wins = summonerSbL.wins;
        summoner.losses = summonerSbL.losses;
        summoner.veteran = summonerSbL.veteran;
        summoner.inactive = summonerSbL.inactive;
        summoner.freshBlood = summonerSbL.freshBlood;
        summoner.hotStreak = summonerSbL.hotStreak;

        // Todo Add Flex and TT
        if (SbLInDB?.queue === "RANKED_SOLO_5x5") {
          summoner.rankSolo = SbLInDB.tier;
        }

        await this.summonerRepo.updateSummonerBySummonerID(summoner);
      }
    }
  };
}
