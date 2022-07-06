import Summoner from "../Models/Interfaces/Summoner";
import SummonerByLeague from "../Models/Interfaces/SummonerByLeague";

export const formatSummonerForSending = (summoner: Summoner): Summoner => {
  try {
    let summonerToSend: Summoner = {
      id: summoner._id,
      summonerId: summoner._id,
      accountId: summoner.accountId,
      puuid: summoner.puuid,
      name: summoner.name,
      profileIconId: summoner.profileIconId,
      revisionDate: summoner.revisionDate,
      summonerLevel: summoner.summonerLevel,
      leaguePoints: summoner.leaguePoints,
      rank: summoner.rank,
      wins: summoner.wins,
      losses: summoner.losses,
      rankSolo: summoner.rankSolo,
      veteran: summoner.veteran,
      inactive: summoner.inactive,
      freshBlood: summoner.freshBlood,
      hotStreak: summoner.hotStreak,
      uninflatedMatchList: summoner.uninflatedMatchList,
      inflatedMatchList: summoner.inflatedMatchList,
      exhaustCount: summoner.exhaustCount,
      exhaustCastCount: summoner.exhaustCastCount,
      zhonaysCount: summoner.zhonaysCount,
      tabisCount: summoner.tabisCount,
      updatedAt: summoner.updatedAt,
      lastMatchUpdate: summoner.lastMatchUpdate,
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
