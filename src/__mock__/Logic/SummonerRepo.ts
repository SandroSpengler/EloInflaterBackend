import Summoner from "../../Models/Interfaces/Summoner";
import { SbLTier } from "../../Models/Types/SummonerByLeagueTypes";

const mockFindAllSummonerByRank = jest.fn(async (rankSolo: SbLTier): Promise<Summoner[] | null> => {
  if (rankSolo === "CHALLENGER") {
    const SbR = require("../Data/SbRChallenger.json");

    return SbR;
  }

  if (rankSolo === "GRANDMASTER") {
    const SbR = require("../Data/SbRGrandMaster.json");

    return SbR;
  }
  if (rankSolo === "MASTER") {
    const SbR = require("../Data/SbRMaster.json");

    return SbR;
  }

  return null;
});

const mockFindSummonerBySummonerID = jest.fn((summonerId: string): Summoner | null => {
  if (summonerId === undefined || summonerId === "" || summonerId === null) {
    throw new Error("SummonerID not defined in Mock-Function");
  }

  let allSummoners: Summoner[] = [];

  const summonersChallenger = require("../Data/SbRChallenger.json");

  const summonersGrandMaster = require("../Data/SbRGrandMaster.json");

  const summonersMaster = require("../Data/SbRMaster.json");

  allSummoners = [...summonersChallenger, ...summonersGrandMaster, ...summonersMaster];

  const summonerInJSON = allSummoners.find((summoner) => summonerId === summoner.id);

  if (summonerInJSON === undefined) return null;

  return summonerInJSON;
});

const mockUpdateSummonerBySummonerID = jest.fn(() => {
  return;
});

const mockCreateSummoner = jest.fn(() => {
  return;
});

export { mockFindAllSummonerByRank, mockUpdateSummonerBySummonerID, mockCreateSummoner, mockFindSummonerBySummonerID };
