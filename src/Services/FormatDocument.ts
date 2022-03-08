import Summoner from "../Models/Interfaces/Summoner";
import SummonerByLeague from "../Models/Interfaces/SummonerByLeague";

export const formatSummonerForSending = (summoner: Summoner): Summoner => {
  try {
    let summonerToSend = {
      id: summoner.id,
      accountId: summoner.accountId,
      puuid: summoner.puuid,
      name: summoner.name,
      profileIconId: summoner.profileIconId,
      revisionDate: summoner.revisionDate,
      matchList: summoner.matchList,
      summonerLevel: summoner.summonerLevel,
      updatedAt: summoner.updatedAt,
    };

    return summonerToSend;
  } catch (error) {
    throw error;
  }
};

export const formatSummonerByLeagueForSending = (summoner: SummonerByLeague): SummonerByLeague => {
  try {
    let summonerToSend: SummonerByLeague = {
      tier: summoner.tier,
      leagueId: summoner.leagueId,
      queue: summoner.queue,
      name: summoner.name,
      entries: summoner.entries,
      updatedAt: summoner.updatedAt,
    };

    return summonerToSend;
  } catch (error) {
    throw error;
  }
};