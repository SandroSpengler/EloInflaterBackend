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
    let requestSummonerName = "mespuites";

    const response = await request(APP).get(`/api/data/summoner/${requestSummonerName}`);

    expect(response.statusCode === 200);

    const summoner: Summoner = response.body.result;

    expect(summoner).toEqual(
      expect.objectContaining({
        name: requestSummonerName,
        puuid: expect.any(String),
        matchList: expect.arrayContaining([expect.any(String)]),
      }),
    );
  });

  it("Expect all Summoners with rankSolo - CHALLENGER", async () => {
    const response = await request(APP).get("/api/data/league/challenger/rankedsolo");

    expect(response.statusCode === 200);

    const summonersByRankSolo: Summoner[] = response.body.result;

    expect(summonersByRankSolo.length).toEqual(300);

    expect(summonersByRankSolo).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          _id: expect.any(String),
          matchList: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
  });
  it("Expect all Summoners with rankSolo - GRANDMASTER", async () => {
    const response = await request(APP).get("/api/data/league/grandmaster/rankedsolo");

    expect(response.statusCode === 200);

    const summonersByRankSolo: Summoner[] = response.body.result;

    expect(summonersByRankSolo.length).toEqual(700);

    expect(summonersByRankSolo).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          _id: expect.any(String),
          matchList: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
  });

  it("Expect all Summoners with rankSolo - MASTER", async () => {
    const response = await request(APP).get("/api/data/league/master/rankedsolo");

    expect(response.statusCode === 200);

    const summonersByRankSolo: Summoner[] = response.body.result;

    expect(summonersByRankSolo.length).toBeGreaterThan(3000);

    expect(summonersByRankSolo).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          _id: expect.any(String),
          matchList: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
  });
});
//#endregion
