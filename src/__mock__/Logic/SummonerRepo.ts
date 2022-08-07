import Summoner from "../../Models/Interfaces/Summoner";
import { SbLTier } from "../../Models/Types/SummonerByLeagueTypes";

const mockFindAllSummonerByRank = jest.fn((rankSolo: SbLTier): Summoner[] | null => {
  if (rankSolo === "CHALLENGER") {
    const SbR = require("../Data/SbRChallenger.json");

    return SbR;
  }

  if (rankSolo === "GRANDMASTER") {
    const SbR = require("../Data/SbLGrandMaster.json");

    return SbR;
  }
  if (rankSolo === "MASTER") {
    const SbR = require("../Data/SbLMaster.json");

    return SbR;
  }

  return null;
});

export { mockFindAllSummonerByRank as mockFindSummonerByRank };
