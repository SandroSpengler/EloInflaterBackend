import Summoner from "../Models/Interfaces/Summoner";
import SummonerSchema from "../Models/Schemas/SummonerSchema";
import SummonerByLeague, { EntriesByLeague } from "../Models/Interfaces/SummonerByLeague";
import SummonerByLeagueSchema from "../Models/Schemas/LeagueSchema";
import { getMatchByMatchId, getMatchesBySummonerpuuid } from "../Services/Http";
import { IMatchSchema } from "../Models/Interfaces/MatchList";
import axios, { Axios, AxiosResponse, AxiosError } from "axios";
import { MatchData, Participant } from "../Models/Interfaces/MatchData";
import { match } from "assert";

//#region Summoner MongoDB
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
  try {
    let summonerInDB = await findSummonerByPUUID(summoner.puuid);

    if (summonerInDB != null) {
      return summonerInDB;
    }
  } catch (error) {
    throw error;
  }

  let tmpSummoner = new SummonerSchema();

  try {
    tmpSummoner.id = summoner.id;
    tmpSummoner.accountId = summoner.accountId;
    tmpSummoner.puuid = summoner.puuid;
    tmpSummoner.name = summoner.name.toLowerCase();
    tmpSummoner.profileIconId = summoner.profileIconId;
    tmpSummoner.revisionDate = summoner.revisionDate;
    tmpSummoner.summonerLevel = summoner.summonerLevel;
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

export const updateSummoner = (summoner: Summoner) => {
  try {
    let currentUnixDate = new Date().getTime();

    SummonerSchema.updateOne({ puuid: summoner.puuid }, summoner).exec();
  } catch (error) {}
};

export const findSummonerByLeague = async (leagueName: String): Promise<SummonerByLeague | null> => {
  try {
    let foundSummonersByLeague: SummonerByLeague | null = await SummonerByLeagueSchema.findOne({
      tier: leagueName.toUpperCase(),
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

export const updatSummonerMatches = async (summoner: Summoner): Promise<Number> => {
  let summonerMatchCount: number = 0;
  let latestMachList: any = [];

  try {
    latestMachList = await getMatchesBySummonerpuuid(summoner.puuid);
  } catch (error) {
    throw error;
  }

  try {
    if (summoner.matchList === undefined) summoner.matchList = [];

    summonerMatchCount = summoner.matchList.length;

    // Compares the latest 100 MatchIds for the Summoner with the already saved matchIds
    const newMatchesList: String[] = latestMachList.data.filter(
      (latestMatchId) =>
        // ! = means the match is not in the array
        !summoner?.matchList.some(({ matchId: summonerMatchId }) => latestMatchId === summonerMatchId)
    );

    for (let i = 0; i < newMatchesList.length; i++) {
      const matchResponse = await getMatchByMatchId(newMatchesList[i]);

      if (matchResponse) {
        // check if exhaust/tabis was abused

        summoner.matchList.push(checkIfSummonerAbusedMatch(summoner, matchResponse.data));
      }
    }

    await updateSummoner(summoner);
    await setUpdateSummonerDate(summoner.puuid);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      let axiosError: AxiosError = error;

      if (axiosError.response?.status === 429) {
        await updateSummoner(summoner);
        await setUpdateSummonerDate(summoner.puuid);
      }
    }

    throw error;
  } finally {
    return summoner.matchList.length - summonerMatchCount;
  }
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

//#endregion
