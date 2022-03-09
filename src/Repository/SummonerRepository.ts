import Summoner from "../Models/Interfaces/Summoner";
import SummonerSchema from "../Models/Schemas/SummonerSchema";
import SummonerByLeague, { EntriesByLeague } from "../Models/Interfaces/SummonerByLeague";
import SummonerByLeagueSchema from "../Models/Schemas/LeagueSchema";
import { getMatchByMatchId, getMatchesBySummonerPUUID } from "../Services/Http";
import { IMatchSchema } from "../Models/Interfaces/MatchList";

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
    tmpSummoner.name = summoner.name;
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

export const updatSummonerMatches = async (summoner: Summoner) => {
  const latestMachList = await getMatchesBySummonerPUUID(summoner.puuid);

  if (summoner.matchList === undefined) summoner.matchList = [];

  // Compares the latest 100 MatchIds for the Summoner with the already saved matchIds
  const newMatchesList: String[] = latestMachList.data.filter(
    (latestMatchId) =>
      // ! = means the match is not in the array
      !summoner?.matchList.some(({ matchId: summonerMatchId }) => latestMatchId === summonerMatchId)
  );

  for (let i = 0; i < 20; i++) {
    const match = await getMatchByMatchId(newMatchesList[i]);

    // check if exhaust/tabis was abused

    // Maybe add more Properties to the Match
    let summonerMatch: IMatchSchema = {
      matchId: newMatchesList[i],
      exhaustAbused: false,
      tabisAbused: false,
    };

    // Add match to summoner
    summoner.matchList.push(summonerMatch);
  }

  await updateSummoner(summoner);
  await setUpdateSummonerDate(summoner.puuid);
};

//#endregion
