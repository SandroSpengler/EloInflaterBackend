import Summoner from "../Models/Interfaces/Summoner";
import SummonerSchema from "../Models/Schemas/SummonerSchema";

export const findSummonerByPUUID = async (puuid: String): Promise<Summoner | null> => {
  try {
    let foundSummoner: Summoner | null = await SummonerSchema.findOne({ puuid: puuid });

    if (foundSummoner != null) return foundSummoner;

    return null;

    // if (foundSummoner == null) return null;
  } catch (error) {
    throw error;
  }
};

export const saveSummoner = async (summoner: Summoner): Promise<Summoner> => {
  let tmpSummoner = new SummonerSchema();

  try {
    tmpSummoner.id = summoner.id;
    tmpSummoner.accountId = summoner.accountId;
    tmpSummoner.puuid = summoner.puuid;
    tmpSummoner.name = summoner.name;
    tmpSummoner.profileIconId = summoner.profileIconId;
    tmpSummoner.revisionDate = summoner.revisionDate;
    tmpSummoner.summonerLevel = summoner.summonerLevel;

    summoner = await tmpSummoner.save();

    return summoner;
  } catch (error) {
    throw error;
  }
};
