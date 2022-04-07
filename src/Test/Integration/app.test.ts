import * as request from "supertest";

import { APP } from "../../app";
import Summoner from "../../Models/Interfaces/Summoner";

describe("Server startup", () => {
  it("Default Endpoint should return an h1", async () => {
    const response = await request(APP).get("/");

    expect(response.statusCode).toEqual(200);
    expect(response.text).toMatch(/(<h1>)/);
  });

  it("Expect a single Summoner", async () => {
    let requestSummonerName = "forevermates";

    const response = await request(APP).get(`/api/data/summoner/${requestSummonerName}`);

    expect(response.statusCode === 200);

    const summoner: Summoner = response.body.result;

    expect(summoner).toEqual(
      expect.objectContaining({
        name: requestSummonerName,
        puuid: expect.any(String),
        matchList: expect.arrayContaining([expect.any(String)]),
      })
    );
  });

  afterEach(async () => {});
});
