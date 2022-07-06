import request from "supertest";
import { Response } from "supertest";
import { APP } from "../../app";

describe("SummonerMatches Endpoint", () => {
  beforeAll(() => {
    // Before All
    // Create Test Summoner
  });

  it.skip("Expect a matchList to be 0", async () => {
    const summonerId: string = "ngQJmMrTc_zbLR8vXHAJmKJo1OmmJXP1ncWZPm_iRUJRdnM";

    // Call api/data/summoner/{summonerName}
    // Expect matchlist

    const response: Response = await request(APP).get(`/api/data/summoner/forevermates`);

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: expect.any(Boolean),
        result: expect.objectContaining({ id: summonerId, matchList: expect.arrayContaining([expect.any(String)]) }),
      }),
    );
  });

  it("Expect matches to update", async () => {
    // Call api/refresh/summoner/byname/{summonerName}
    // Get Summoner
    // Expect Status 200 or 429
    // Expect to have changed or be the same

    const summonerId: string = "ngQJmMrTc_zbLR8vXHAJmKJo1OmmJXP1ncWZPm_iRUJRdnM";

    const response: Response = await request(APP).get(`/api/refresh/match/${summonerId}`);

    expect([200, 403]).toContain(response.statusCode);
    // expect(response.statusCode).toEqual(200);

    // expect matchlist to have updated

    // Else expect 429
  });

  it.skip("Expect matchlist to have updated", async () => {
    // Call api/refresh/summoner/byname/{summonerName}
    // Get Summoner
    // Expect Status 200 or 429
    // Expect to have changed or be the same
  });

  it.skip("Expect all Summoner matches", async () => {
    // Call api/data/match/matches/{summonerId}
    // add http parameter ?size=20
    // Expect Response.Content === summoner.matchList
  });

  it.skip("Expect all Summoner Inflated Matches", async () => {
    // Call api/data/match/inflated/{summonerId}
    // add http parameter ?size=20
    // Expect summoner.matchList contains Response.content
  });
});
