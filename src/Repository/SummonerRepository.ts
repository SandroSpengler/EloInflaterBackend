import SummonerSchema from "../Models/Interfaces/Schemas/SummonerSchema";
import { Summoner } from "../Models/Interfaces/Summoner";

export const findSummonerByPUUID = async (puuid: String): Promise<Summoner> => {
  let tmpSummoner = new SummonerSchema();

  tmpSummoner.save();

  try {
    // let foundSummoner: Summoner = await tmpSummoner.fin

    return tmpSummoner;
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
