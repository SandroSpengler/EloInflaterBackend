import request from "supertest";

import { APP } from "../../app";
import Summoner from "../../Models/Interfaces/Summoner";

describe("Server startup", () => {
  it("Default Endpoint should return an h1", async () => {
    const response = await request(APP).get("/");

    expect(response.statusCode).toEqual(200);
    expect(response.text).toMatch(/(<h1>)/);
  });

  afterEach(async () => {});
});

//#region Summoner Tests
describe("Summoner CRUD-Endpoint", () => {
  it("Expect a single Summoner with name and matchlist", async () => {
    const summonerNames = ["agurin", "fasdhfsadfjhsdjf,,,,,..n", "", undefined];

    const responseWorking = await request(APP).get(`/api/data/summoner/${summonerNames[0]}`);

    const summonerWorking: Summoner = responseWorking.body.result;

    expect(responseWorking.statusCode === 200);

    expect(summonerWorking).toMatchObject({
      name: "Agurin",
      puuid: expect.any(String),
      // matchList: expect.arrayContaining([expect.any(String)]),
    });

    const responseGibberish = await request(APP).get(`/api/data/summoner/${summonerNames[1]}`);

    expect(responseGibberish.statusCode).toEqual(404);

    expect(responseGibberish.body).toMatchObject({
      success: false,
      result: null,
      error: "Summoner not found",
    });

    const responseEmptyString = await request(APP).get(`/api/data/summoner/${summonerNames[2]}`);

    expect(responseEmptyString.statusCode).toEqual(409);

    expect(responseGibberish.body).toMatchObject({
      success: false,
      result: null,
      error: "Summoner not found",
    });
  });

  it.skip("Expect all Summoners with rankSolo - CHALLENGER", async () => {
    const response = await request(APP).get("/api/data/league/challenger/rankedsolo");

    expect(response.statusCode === 200);

    const summonersByRankSolo: Summoner[] = response.body.result;

    expect(summonersByRankSolo.length).toEqual(300);

    expect(summonersByRankSolo).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          _id: expect.any(String),
          // matchList: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
  });

  it.skip("Expect all Summoners with rankSolo - GRANDMASTER", async () => {
    const response = await request(APP).get("/api/data/league/grandmaster/rankedsolo");

    expect(response.statusCode === 200);

    const summonersByRankSolo: Summoner[] = response.body.result;

    expect(summonersByRankSolo.length).toEqual(700);

    expect(summonersByRankSolo).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          _id: expect.any(String),
          // matchList: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
  });

  it.skip("Expect all Summoners with rankSolo - MASTER", async () => {
    const response = await request(APP).get("/api/data/league/master/rankedsolo");

    expect(response.statusCode === 200);

    const summonersByRankSolo: Summoner[] = response.body.result;

    expect(summonersByRankSolo.length).toBeGreaterThan(3000);

    expect(summonersByRankSolo).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          _id: expect.any(String),
          // matchList: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
  });
});
//#endregion
