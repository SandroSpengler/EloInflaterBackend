import SummonerByLeague, { EntriesByLeague } from "../Models/Interfaces/SummonerByLeague";
import SummonerSchema from "../Models/Schemas/SummonerSchema";
import SummonerByLeagueSchema from "../Models/Schemas/SummonerByLeagueSchema";
import { SbLTier, SbLQueue } from "../Models/Types/SummonerByLeagueTypes";

export class SummonerByLeagueRepository {
  /**
   * Find SummonerByLeague Collection by tier and queue
   *
   * @param tier Name of the Divison Tier
   * @param queue Name of the Queue Type
   *
   * @returns Promise<SummonerByLeague>
   */
  public findSummonerByLeague = async (tier: SbLTier, queue: SbLQueue): Promise<SummonerByLeague> => {
    try {
      let foundSummonersByLeague: SummonerByLeague | null = await SummonerByLeagueSchema.findOne({
        tier: tier,
        queue: queue,
      }).lean();

      if (foundSummonersByLeague !== null) return foundSummonersByLeague;

      if (foundSummonersByLeague === null) {
        throw new Error(`No entry exists for SummmonerByLeague with leagueName ${tier} and queue ${queue}`);
      }

      throw new Error("Could not find SummonerByLeague");
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

  updateSummonerByLeauge = async (SbL: SummonerByLeague): Promise<void> => {
    try {
      await SummonerByLeagueSchema.updateOne({ tier: SbL.tier }, SbL);
    } catch (error) {
      throw error;
    }
  };

  updateSummonerByLeagueEntries = async (leagueName: string, entries: EntriesByLeague[]): Promise<void> => {
    try {
      let currentUnixDate = new Date().getTime();

      SummonerByLeagueSchema.updateOne({ tier: leagueName }, { entries: entries, updatedAt: currentUnixDate }).exec();
    } catch (error) {
      throw Error;
    }
  };
}
