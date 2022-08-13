import SummonerByLeague from "../../Models/Interfaces/SummonerByLeague";
import { SbLQueue, SbLTier } from "../../Models/Types/SummonerByLeagueTypes";

const mockFindSummonerByLeague = jest.fn((tier: SbLTier, queue: SbLQueue): SummonerByLeague | null => {
  if (tier === "CHALLENGER") {
    const SbL = require("../Data/SbLChallenger.json");

    return SbL;
  }

  if (tier === "GRANDMASTER") {
    const SbL = require("../Data/SbLGrandMaster.json");

    return SbL;
  }
  if (tier === "MASTER") {
    const SbL = require("../Data/SbLMaster.json");

    return SbL;
  }

  return null;
});

export { mockFindSummonerByLeague };
