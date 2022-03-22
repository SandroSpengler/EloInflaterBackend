import Summoner from "../Models/Interfaces/Summoner";
import SummonerSchema from "../Models/Schemas/SummonerSchema";
import SummonerByLeague, { EntriesByLeague } from "../Models/Interfaces/SummonerByLeague";
import SummonerByLeagueSchema from "../Models/Schemas/LeagueSchema";
import {
  getMatchByMatchId,
  getMatchesIdsBySummonerpuuid,
  getSummonerByName,
  getSummonerBySummonerId,
} from "../Services/Http";
import { IMatchSchema } from "../Models/Interfaces/MatchList";

import { MatchData, Participant } from "../Models/Interfaces/MatchData";
import axios, { AxiosError } from "axios";
import { addMatchesForSummonerPUUID } from "./MatchRepository";

//#region Summoner MongoDB
export const findAllSummoners = async (): Promise<Summoner[] | null> => {
  try {
    let foundSummoner: Summoner[] | null = await SummonerSchema.find().lean(); // .lean() returns only the json and not the mongoose.document

    if (foundSummoner != null) return foundSummoner;

    return null;

    // if (foundSummoner == null) return null;
  } catch (error) {
    throw error;
  }
};

export const findAllSummonersByRank = async (rank: string, queueType?: string) => {
  try {
    let foundSummoner: Summoner[] | null;

    foundSummoner = await SummonerSchema.find({ rankSolo: rank }).populate("matchList").lean();

    if (foundSummoner != null) return foundSummoner;

    return null;

    // if (foundSummoner == null) return null;
  } catch (error) {
    throw error;
  }
};

export const findSummonerByPUUID = async (puuid: String): Promise<Summoner | null> => {
  try {
    let foundSummoner: Summoner | null = await SummonerSchema.findOne({ puuid: puuid }).lean(); // .lean() returns only the json and not the mongoose.document

    if (foundSummoner != null) return foundSummoner;

    return null;

    // if (foundSummoner == null) return null;
  } catch (error) {
    throw error;
  }
};

export const findSummonerByID = async (summonerId: String): Promise<Summoner | null> => {
  try {
    let foundSummoner: Summoner | null = await SummonerSchema.findOne({ _id: summonerId }).lean(); // .lean() returns only the json and not the mongoose.document

    if (foundSummoner != null) return foundSummoner;

    return null;

    // if (foundSummoner == null) return null;
  } catch (error) {
    throw error;
  }
};

export const findSummonerByName = async (name: String): Promise<Summoner | null> => {
  try {
    let foundSummoner: Summoner | null = await SummonerSchema.findOne({ name: name.toLowerCase() }).lean(); // .lean() returns only the json and not the mongoose.document

    if (foundSummoner != null) return foundSummoner;

    return null;

    // if (foundSummoner == null) return null;
  } catch (error) {
    throw error;
  }
};

export const createSummoner = async (summoner: Summoner): Promise<Summoner> => {
  if (summoner.puuid != "") {
    try {
      let summonerInDB = await findSummonerByPUUID(summoner.puuid);

      if (summonerInDB != null) {
        return summonerInDB;
      }
    } catch (error) {
      throw error;
    }
  }

  let tmpSummoner = new SummonerSchema();

  try {
    tmpSummoner._id = summoner.id;
    tmpSummoner.id = summoner.id;
    tmpSummoner.summonerId = summoner.summonerId;
    tmpSummoner.accountId = summoner.accountId;
    tmpSummoner.puuid = summoner.puuid;
    tmpSummoner.name = summoner.name.toLowerCase();
    tmpSummoner.profileIconId = summoner.profileIconId;
    tmpSummoner.revisionDate = summoner.revisionDate;
    tmpSummoner.summonerLevel = summoner.summonerLevel;
    tmpSummoner.leaguePoints = summoner.leaguePoints;
    tmpSummoner.rank = summoner.rank;
    tmpSummoner.rankSolo = summoner.rankSolo;
    tmpSummoner.flexSolo = summoner.flexSolo;
    tmpSummoner.flextt = summoner.flextt;
    tmpSummoner.wins = summoner.wins;
    tmpSummoner.losses = summoner.losses;
    tmpSummoner.veteran = summoner.veteran;
    tmpSummoner.inactive = summoner.inactive;
    tmpSummoner.freshBlood = summoner.freshBlood;
    tmpSummoner.hotStreak = summoner.hotStreak;
    tmpSummoner.matchList = summoner.matchList;
    tmpSummoner.updatedAt = new Date().getTime();

    summoner = await tmpSummoner.save();

    return summoner;
  } catch (error) {
    throw error;
  }
};

export const setUpdateSummonerDate = (puuid: string) => {
  try {
    let currentUnixDate = new Date().getTime();

    SummonerSchema.updateOne({ puuid: puuid }, { updatedAt: currentUnixDate }).exec();
  } catch (error) {}
};

export const updateSummonerByPUUID = async (summoner: Summoner) => {
  try {
    let currentUnixDate = new Date().getTime();

    await SummonerSchema.updateOne({ puuid: summoner.puuid }, summoner).exec();
  } catch (error) {}
};

export const updateSummonerBySummonerID = (summoner: Summoner) => {
  try {
    let currentUnixDate = new Date().getTime();

    SummonerSchema.updateOne({ _id: summoner._id }, summoner).exec();
  } catch (error) {}
};

export const findSummonerByLeague = async (leagueName: string, queue: string): Promise<SummonerByLeague | null> => {
  try {
    let foundSummonersByLeague: SummonerByLeague | null = await SummonerByLeagueSchema.findOne({
      tier: leagueName.toUpperCase(),
      queue: queue,
    }).lean();

    if (foundSummonersByLeague != null) return foundSummonersByLeague;

    return null;

    // if (foundSummoner == null) return null;
  } catch (error) {
    throw error;
  }
};

//#endregion

//#region SummonerByLeague MongoDB
export const saveSummonerByLeague = async (summonerByLeague: SummonerByLeague): Promise<SummonerByLeague> => {
  try {
    let tmpSummonerByLeague = new SummonerByLeagueSchema();

    tmpSummonerByLeague.tier = summonerByLeague.tier;
    tmpSummonerByLeague.leagueId = summonerByLeague.leagueId;
    tmpSummonerByLeague.queue = summonerByLeague.queue;
    tmpSummonerByLeague.name = summonerByLeague.name;
    tmpSummonerByLeague.entries = summonerByLeague.entries;

    summonerByLeague = await tmpSummonerByLeague.save();

    return summonerByLeague;
  } catch (error) {
    throw error;
  }
};

export const updateSummonerByLeague = async (leagueName: string, entries: EntriesByLeague[]) => {
  try {
    let currentUnixDate = new Date().getTime();

    // loop through entries and update the updatedAt Time
    SummonerByLeagueSchema.updateOne(
      { tier: leagueName.toUpperCase() },
      { entries: entries, updatedAt: currentUnixDate }
    ).exec();
  } catch (error) {}
};

//#endregion

//#region Summoner Processing

export const checkIfSummonerCanBeUpdated = (summoner: Summoner): Boolean => {
  if (summoner.updatedAt! < new Date().getTime()) return true;

  return false;
};

export const updatSummonerMatches = async (summoner: Summoner) => {
  console.log("updating summoner");
};

export const checkIfSummonerAbusedMatch = (summoner: Summoner, match: MatchData): IMatchSchema => {
  let summonerMatchDetails: IMatchSchema = {
    matchId: match.metadata.matchId,
    exhaustAbused: false,
    tabisAbused: false,
  };

  try {
    let summonerParticipantDetails: Participant | undefined = match.info.participants.find(
      (participant) => participant.puuid === summoner.puuid
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

export const updateSumonersByQueue = async (summonerByLeagueInDB: SummonerByLeague) => {
  for (let i = 0; i < summonerByLeagueInDB.entries.length; i++) {
    // let summoner = await findSummonerByID(summonerByLeagueInDB.entries[i].summonerId);
    let summoner = await findSummonerByID(summonerByLeagueInDB.entries[i].summonerId);

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
        matchList: [],
        updatedAt: summonerByLeagueInDB.updatedAt,
      };

      // Todo Add Flex and TT
      if (summonerByLeagueInDB?.queue === "RANKED_SOLO_5x5") {
        summonerToSave.rankSolo = summonerByLeagueInDB.tier;
      }

      try {
        await createSummoner(summonerToSave);
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

      await updateSummonerBySummonerID(summoner);
    }
  }
};

export const validateSummonerIds = async (updateType: string) => {
  console.log("1. Checking Summoners Ids in queue: " + updateType);

  // current rank of top summoners
  let summonerByLeague: SummonerByLeague | null = await findSummonerByLeague(updateType, "RANKED_SOLO_5x5");

  if (!summonerByLeague) return;

  // Check if summonerByLeague are newer than 24 hours

  // summoner as saved in db
  let summonerList: Summoner[] | null = await findAllSummonersByRank(updateType);

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
          summonerInfo = (await getSummonerBySummonerId(summoner.summonerId)).data;
        } catch (error) {
          break;
        }

        let summonerToSave = summoner;

        summonerToSave.accountId = summonerInfo.accountId;
        summonerToSave.puuid = summonerInfo.puuid;
        summonerToSave.profileIconId = summonerInfo.profileIconId;
        summonerToSave.revisionDate = summonerInfo.revisionDate;
        summonerToSave.summonerLevel = summonerInfo.summonerLevel;

        await updateSummonerBySummonerID(summonerToSave);

        console.log(`validated ${summoner.name} in queue ${updateType} at index ${index}`);
      }
    } catch (error) {
      break;
    }
  }
};

export const validateSummonerLeague = async (updateType: string) => {
  console.log("2. validating summonersByLeague " + updateType);
  // current rank of top summoners
  let summonerByLeague: SummonerByLeague | null = await findSummonerByLeague(updateType, "RANKED_SOLO_5x5");

  let summonerList: Summoner[] | null = await findAllSummonersByRank(updateType);

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

      await updateSummonerByPUUID(oldSummoner);

      continue;
    }

    oldSummoner.rank = currentSummonerInLeague.rank;
    oldSummoner.wins = currentSummonerInLeague.wins;
    oldSummoner.losses = currentSummonerInLeague.losses;
    oldSummoner.leaguePoints = currentSummonerInLeague.leaguePoints;
    oldSummoner.lastRankUpdate = summonerByLeague.updatedAt;

    await updateSummonerByPUUID(oldSummoner);
    continue;
  }

  try {
  } catch (error) {
    console.log(error);
  }
};

//#endregion
