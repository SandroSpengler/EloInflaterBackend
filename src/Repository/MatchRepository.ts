import * as mongoose from "mongoose";

import { MatchData } from "../Models/Interfaces/MatchData";

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

export const findMatchById = async (matchId: string): Promise<MatchData | null> => {
  let matchById: MatchData | null;
  try {
    matchById = await MatchSchema.find({ _id: matchId }).lean();

    return matchById;
  } catch (error) {}

  return null;
};

export const findAllMatchesBySummonerId = async (summonerId: string): Promise<MatchData[] | null> => {
  let matchById: MatchData[] | null;
  try {
    matchById = await MatchSchema.find({ summonerId: summonerId }).lean();

    return matchById;
  } catch (error) {}

  return null;
};

export const findAllMatchesBySummonerPUUID = async (summonerPUUID: string): Promise<MatchData[] | null> => {
  let matchById: MatchData[] | null;
  try {
    matchById = await MatchSchema.find({ summonerId: summonerPUUID }).lean();

    return matchById;
  } catch (error) {}

  return null;
};

export const createMatchWithSummonerInformation = async (
  match: MatchData,
  summonerPUUID,
  summonerId: string
): Promise<MatchData | null> => {
  try {
    let tmpMatch = new MatchSchema();

    tmpMatch._id = match.metadata.matchId;
    tmpMatch.summonerId = summonerId;
    tmpMatch.summonerPUUID = summonerPUUID;
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
