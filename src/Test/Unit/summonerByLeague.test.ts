import SummonerByLeague from "../../Models/Interfaces/SummonerByLeague";
import { checkIfSummonersByLeagueCanBeUpdated } from "../../Repository/SummonerRepository";

describe("Summoner by Leauge Function Test", () => {
  let summonerByLeagueMock: SummonerByLeague;

  beforeAll(async () => {
    summonerByLeagueMock = require("../TestSampleData/MockSummonerByLeague.json");
  });

  it("Function => checkIfSummonersByLeagueCanBeUpdated", () => {
    expect(checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(true);
  });
});
