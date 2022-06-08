import { checkIfSummonersByLeagueCanBeUpdated } from "../../Repository/SummonerRepository";

describe("Summoner by Leauge Function Test", () => {
  it("Function => checkIfSummonersByLeagueCanBeUpdated", () => {
    let summonerByLeagueMock: any = {};

    expect(checkIfSummonersByLeagueCanBeUpdated(summonerByLeagueMock)).toEqual(true);
  });
});
