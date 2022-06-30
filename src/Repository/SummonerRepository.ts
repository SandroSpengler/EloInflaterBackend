import Summoner from "../Models/Interfaces/Summoner";
import SummonerSchema from "../Models/Schemas/SummonerSchema";

export class SummonerRepository {
  //#region Summoner MongoDB
  public findAllSummoners = async (): Promise<Summoner[] | null> => {
    try {
      let foundSummoner: Summoner[] | null = await SummonerSchema.find().lean(); // .lean() returns only the json and not the mongoose.document

      if (foundSummoner != null) return foundSummoner;

      return null;

      // if (foundSummoner == null) return null;
    } catch (error) {
      throw error;
    }
  };

  public findAllSummonersByRank = async (rank: string, queueType?: string) => {
    try {
      let foundSummoner: Summoner[] | null;

      foundSummoner = await SummonerSchema.find({ rankSolo: rank }).lean();

      if (foundSummoner != null) return foundSummoner;

      return null;

      // if (foundSummoner == null) return null;
    } catch (error) {
      throw error;
    }
  };

  public findSummonerByPUUID = async (puuid: String): Promise<Summoner | null> => {
    try {
      let foundSummoner: Summoner | null = await SummonerSchema.findOne({ puuid: puuid }).lean(); // .lean() returns only the json and not the mongoose.document

      if (foundSummoner != null) return foundSummoner;

      return null;

      // if (foundSummoner == null) return null;
    } catch (error) {
      throw error;
    }
  };

  public findSummonerByID = async (summonerId: String): Promise<Summoner | null> => {
    try {
      let foundSummoner: Summoner | null = await SummonerSchema.findOne({ _id: summonerId }).lean(); // .lean() returns only the json and not the mongoose.document

      if (foundSummoner != null) return foundSummoner;

      return null;

      // if (foundSummoner == null) return null;
    } catch (error) {
      throw error;
    }
  };

  public findSummonerByName = async (name: String): Promise<Summoner | null> => {
    try {
      let foundSummoner: Summoner | null = await SummonerSchema.findOne({ name: name.toLowerCase() }).lean(); // .lean() returns only the json and not the mongoose.document

      if (foundSummoner != null) return foundSummoner;

      return null;

      // if (foundSummoner == null) return null;
    } catch (error) {
      throw error;
    }
  };

  public createSummoner = async (summoner: Summoner): Promise<Summoner> => {
    if (summoner.puuid != "") {
      try {
        let summonerInDB = await this.findSummonerByPUUID(summoner.puuid);

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

      if (summoner.profileIconId) tmpSummoner.profileIconId = summoner.profileIconId;
      if (summoner.revisionDate) tmpSummoner.revisionDate = summoner.revisionDate;
      if (summoner.summonerLevel) tmpSummoner.summonerLevel = summoner.summonerLevel;
      if (summoner.leaguePoints) tmpSummoner.leaguePoints = summoner.leaguePoints;
      if (summoner.rank) tmpSummoner.rank = summoner.rank;
      if (summoner.rankSolo) tmpSummoner.rankSolo = summoner.rankSolo;
      if (summoner.flexSolo) tmpSummoner.flexSolo = summoner.flexSolo;
      if (summoner.flextt) tmpSummoner.flextt = summoner.flextt;
      if (summoner.wins) tmpSummoner.wins = summoner.wins;
      if (summoner.losses) tmpSummoner.losses = summoner.losses;
      if (summoner.veteran) tmpSummoner.veteran = summoner.veteran;
      if (summoner.inactive) tmpSummoner.inactive = summoner.inactive;
      if (summoner.freshBlood) tmpSummoner.freshBlood = summoner.freshBlood;
      if (summoner.hotStreak) tmpSummoner.hotStreak = summoner.hotStreak;
      if (summoner.matchList) tmpSummoner.matchList = summoner.matchList;
      if (summoner.exhaustCount) tmpSummoner.exhaustCount = summoner.exhaustCount;
      if (summoner.exhaustCastCount) tmpSummoner.exhaustCastCount = summoner.exhaustCastCount;
      if (summoner.tabisCount) tmpSummoner.tabisCount = summoner.tabisCount;
      if (summoner.zhonaysCount) tmpSummoner.zhonaysCount = summoner.zhonaysCount;
      if (summoner.zhonaysCastCount) tmpSummoner.zhonaysCastCount = summoner.zhonaysCastCount;

      tmpSummoner.updatedAt = new Date().getTime();

      summoner = await tmpSummoner.save();

      return summoner;
    } catch (error) {
      throw error;
    }
  };

  public updateSummonerByPUUID = async (summoner: Summoner) => {
    try {
      let currentUnixDate = new Date().getTime();

      await SummonerSchema.updateOne({ puuid: summoner.puuid }, summoner).exec();
    } catch (error) {}
  };

  public updateSummonerBySummonerID = (summoner: Summoner) => {
    try {
      let currentUnixDate = new Date().getTime();

      SummonerSchema.updateOne({ _id: summoner._id }, summoner).exec();
    } catch (error) {}
  };

  deleteSummonerById = async (summonerId: string) => {
    try {
      await SummonerSchema.deleteOne({ _id: summonerId }).exec();
    } catch (error) {
      throw error;
    }
  };

  public setUpdateSummonerDate = (puuid: string) => {
    try {
      let currentUnixDate = new Date().getTime();

      SummonerSchema.updateOne({ puuid: puuid }, { updatedAt: currentUnixDate }).exec();
    } catch (error) {}
  };
}
