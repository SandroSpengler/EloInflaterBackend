import SummonerByLeague, { EntriesByLeague } from "../Models/Interfaces/SummonerByLeague";
import SummonerSchema from "../Models/Schemas/SummonerSchema";
import SummonerByLeagueSchema from "../Models/Schemas/SummonerByLeagueSchema";

export class SummonerByLeagueRepository {
  public findSummonerByLeague = async (leagueName: string, queue: string): Promise<SummonerByLeague | null> => {
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

  deleteSummonerById = async (summonerId: string) => {
    try {
      await SummonerSchema.deleteOne({ _id: summonerId }).exec();
    } catch (error) {
      throw error;
    }
  };

  saveSummonerByLeague = async (summonerByLeague: SummonerByLeague): Promise<SummonerByLeague> => {
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

  updateSummonerByLeague = async (leagueName: string, entries: EntriesByLeague[]) => {
    try {
      let currentUnixDate = new Date().getTime();

      // loop through entries and update the updatedAt Time
      SummonerByLeagueSchema.updateOne(
        { tier: leagueName.toUpperCase() },
        { entries: entries, updatedAt: currentUnixDate },
      ).exec();
    } catch (error) {}
  };
}
