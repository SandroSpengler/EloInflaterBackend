import * as mongoose from "mongoose";

import { MatchData, Participant } from "../Models/Interfaces/MatchData";

import Summoner from "../Models/Interfaces/Summoner";
import MatchSchema from "../Models/Schemas/MatchSchema";
// import { getMatchesIdsBySummonerpuuid } from "../Services/Http";
// import { updateSummonerByPUUID } from "./SummonerRepository";

export class MatchRepository {
  constructor() {}

  findAllMachtes = async (): Promise<MatchData[] | null> => {
    let allMatches: MatchData[] | null;
    try {
      allMatches = await MatchSchema.find().lean();

      return allMatches;
    } catch (error) {}

    return null;
  };

  findMatchById = async (matchId: string): Promise<MatchData | null> => {
    let matchById: MatchData | null;
    try {
      matchById = await MatchSchema.findOne({ _id: matchId }).lean();

      return matchById;
    } catch (error) {
      return null;
    }
  };

  /**
   * Find all Matches for the MatchIds inside the Summoner.MatchList
   *
   * @retuns List of MatchData for Summoner
   */
  findMatchesByIdList = async (matchIdList: string[]): Promise<MatchData[] | null> => {
    let foundMatches: MatchData[] = [];
    try {
      if (!matchIdList || matchIdList.length === 0) return null;

      for (const matchId of matchIdList) {
        let matchById = await MatchSchema.findOne({ _id: matchId }).lean();

        if (matchById === null) continue;

        foundMatches.push(matchById);
      }

      return foundMatches;
    } catch (error) {
      return null;
    }
  };

  findAllMatchesBySummonerPUUID = async (summonerPUUID: string): Promise<MatchData[]> => {
    let matchesById: MatchData[];
    try {
      // matchesById = await MatchSchema.find({})
      //   .lean()
      //   // .find({
      //   //   "metadata.participants": {
      //   //     $in: ["wNmqP7H1ywT7s9VV-i6gMaaUD9d6ugPuqmf2U6wOHdPpFCBdwDkc29cfhVltttRRVwUbwvI0yz4AnQ"],
      //   //   },
      //   // })
      //   .where("metadata.participants")
      //   .in([summonerPUUID]);

      // .all(["wNmqP7H1ywT7s9VV-i6gMaaUD9d6ugPuqmf2U6wOHdPpFCBdwDkc29cfhVltttRRVwUbwvI0yz4AnQ"])

      //  .in([String]) or {$in:[String]}
      // ONE of the values inside that array has to be present

      //  .all([String]) or {$all:[String]}
      // ALL of the values inside that array has to be present

      // .all([String]) === .in([String]) BUT .all([String,String]) !== .in([String,String])

      matchesById = await MatchSchema.find({ "info.participants.puuid": summonerPUUID }).lean();
      // .select("info");
      // .find({
      //   "metadata.participants": {
      //     $in: ["wNmqP7H1ywT7s9VV-i6gMaaUD9d6ugPuqmf2U6wOHdPpFCBdwDkc29cfhVltttRRVwUbwvI0yz4AnQ"],
      //   },
      // })
      // .where("metadata.participants")
      // .in([summonerPUUID]);

      return matchesById;
    } catch (error) {
      throw error;
    }
  };

  createMatch = async (match: MatchData): Promise<MatchData | null> => {
    try {
      let tmpMatch = new MatchSchema();

      tmpMatch._id = match.metadata.matchId;
      tmpMatch.metadata = match.metadata;
      tmpMatch.info = match.info;

      await tmpMatch.save();
    } catch (error) {
      throw error;
    }

    return null;
  };

  updateMatch = async (match: MatchData): Promise<MatchData | null> => {
    let matchById: MatchData | null;
    try {
      await MatchSchema.updateOne({ _id: match._id }, match).exec();
    } catch (error) {
      throw error;
    }

    return null;
  };

  addMatchesForSummonerPUUID = async (match: MatchData) => {
    // Maybe
    // Check what matches are already in DB

    try {
    } catch (error) {
      throw error;
    }

    return null;
  };
}
