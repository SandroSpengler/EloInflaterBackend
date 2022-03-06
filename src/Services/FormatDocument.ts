import Summoner from "../Models/Interfaces/Summoner";

export const formatSummonerForSending = (summoner: Summoner): Summoner => {
  try {
    let summonerToSend = {
      id: summoner.id,
      accountId: summoner.accountId,
      puuid: summoner.puuid,
      name: summoner.name,
      profileIconId: summoner.profileIconId,
      revisionDate: summoner.revisionDate,
      summonerLevel: summoner.summonerLevel,
      updatedAt: summoner.updatedAt,
    };

    return summonerToSend;
  } catch (error) {
    throw error;
  }
};
