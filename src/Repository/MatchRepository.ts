import * as mongoose from "mongoose";

import { MatchData, Participant } from "../Models/Interfaces/MatchData";

import Summoner from "../Models/Interfaces/Summoner";
import MatchSchema from "../Models/Schemas/MatchSchema";

export const findAllMachtes = async (): Promise<MatchData[] | null> => {
  let allMatches: MatchData[] | null;
  try {
    allMatches = await MatchSchema.find().lean();

    return allMatches;
  } catch (error) {}

  return null;
};

export const findMatchById = async (matchId: string): Promise<MatchData[] | null> => {
  let matchById: MatchData[] | null;
  try {
    matchById = await MatchSchema.find({ _id: matchId }).lean();

    return matchById;
  } catch (error) {
    return null;
  }
};

export const findAllMatchesBySummonerPUUID = async (summonerPUUID: string): Promise<MatchData[] | null> => {
  let matchesById: MatchData[] | null;
  try {
    matchesById = await MatchSchema.find({})
      // .find({
      //   "metadata.participants": {
      //     $in: ["wNmqP7H1ywT7s9VV-i6gMaaUD9d6ugPuqmf2U6wOHdPpFCBdwDkc29cfhVltttRRVwUbwvI0yz4AnQ"],
      //   },
      // })
      .where("metadata.participants")
      .in(["wNmqP7H1ywT7s9VV-i6gMaaUD9d6ugPuqmf2U6wOHdPpFCBdwDkc29cfhVltttRRVwUbwvI0yz4AnQ"])
      // .all(["wNmqP7H1ywT7s9VV-i6gMaaUD9d6ugPuqmf2U6wOHdPpFCBdwDkc29cfhVltttRRVwUbwvI0yz4AnQ"])
      .lean();

    //  .in([String]) or {$in:[String]}
    // ONE of the values inside that array has to be present

    //  .all([String]) or {$all:[String]}
    // ALL of the values inside that array has to be present

    // .all([String]) === .in([String]) BUT .all([String,String]) !== .in([String,String])

    return matchesById;
  } catch (error) {
    throw error;
  }
};

export const createMatchWithSummonerInformation = async (
  match: MatchData,
  summonerPUUID,
  summonerId: string
): Promise<MatchData | null> => {
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

export const updateMatch = async (match: MatchData): Promise<MatchData | null> => {
  let matchById: MatchData | null;
  try {
    await MatchSchema.updateOne({ _id: match._id }, match).exec();
  } catch (error) {
    throw error;
  }

  return null;
};

export const addMatchesForSummonerPUUID = async (match: MatchData) => {
  // Maybe
  // Check what matches are already in DB

  try {
  } catch (error) {
    throw error;
  }

  return null;
};

export const checkSummonerMatchesForEloInflation = (summonerMatches) => {
  let matchesForSummonerPUUID: Participant[] = [];

  for (const match of summonerMatches) {
    let summonerMatch: Participant = match.info[0].participants.find((participant) => {
      return participant.puuid === "wNmqP7H1ywT7s9VV-i6gMaaUD9d6ugPuqmf2U6wOHdPpFCBdwDkc29cfhVltttRRVwUbwvI0yz4AnQ";
    });
    matchesForSummonerPUUID.push(summonerMatch);
  }

  console.log(matchesForSummonerPUUID);
};
