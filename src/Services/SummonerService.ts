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

  updateSumonersByQueue = async (summonerByLeagueInDB: SummonerByLeague) => {
    for (let i = 0; i < summonerByLeagueInDB.entries.length; i++) {
      // let summoner = await findSummonerByID(summonerByLeagueInDB.entries[i].summonerId);
      let summoner = await this.summonerRepo.findSummonerByID(summonerByLeagueInDB.entries[i].summonerId);

      if (!summoner) {
        let summonerToSave: Summoner = {
          _id: summonerByLeagueInDB.entries[i].summonerId,
          id: summonerByLeagueInDB.entries[i].summonerId,
          summonerId: summonerByLeagueInDB.entries[i].summonerId,
          accountId: "",
          puuid: "",
          name: summonerByLeagueInDB.entries[i].summonerName,
          profileIconId: 0,
          revisionDate: 0,
          summonerLevel: 0,
          leaguePoints: summonerByLeagueInDB.entries[i].leaguePoints,
          rank: summonerByLeagueInDB.entries[i].rank,
          rankSolo: "",
          wins: summonerByLeagueInDB.entries[i].wins,
          losses: summonerByLeagueInDB.entries[i].losses,
          veteran: summonerByLeagueInDB.entries[i].veteran,
          inactive: summonerByLeagueInDB.entries[i].inactive,
          freshBlood: summonerByLeagueInDB.entries[i].freshBlood,
          hotStreak: summonerByLeagueInDB.entries[i].hotStreak,
          updatedAt: summonerByLeagueInDB.updatedAt,
        };

        // Todo Add Flex and TT
        if (summonerByLeagueInDB?.queue === "RANKED_SOLO_5x5") {
          summonerToSave.rankSolo = summonerByLeagueInDB.tier;
        }

        try {
          await this.summonerRepo.createSummoner(summonerToSave);
        } catch (error) {
          console.log(error);
        }
      }

      if (summoner) {
        summoner.leaguePoints = summonerByLeagueInDB.entries[i].leaguePoints;
        summoner.rank = summonerByLeagueInDB.entries[i].rank;
        summoner.rankSolo = "";
        summoner.wins = summonerByLeagueInDB.entries[i].wins;
        summoner.losses = summonerByLeagueInDB.entries[i].losses;
        summoner.veteran = summonerByLeagueInDB.entries[i].veteran;
        summoner.inactive = summonerByLeagueInDB.entries[i].inactive;
        summoner.freshBlood = summonerByLeagueInDB.entries[i].freshBlood;
        summoner.hotStreak = summonerByLeagueInDB.entries[i].hotStreak;

        // Todo Add Flex and TT
        if (summonerByLeagueInDB?.queue === "RANKED_SOLO_5x5") {
          summoner.rankSolo = summonerByLeagueInDB.tier;
        }

        await this.summonerRepo.updateSummonerBySummonerID(summoner);
      }
    }
  };
}
