import { connectToMongoDB } from "../../app";
import Summoner from "../../Models/Interfaces/Summoner";
import {
  findAllSummoners,
  findSummonerByName,
  findSummonerByPUUID,
  findSummonerByID,
} from "../../Repository/SummonerRepository";

describe("Summoner Queries", () => {
  beforeAll(async () => {
    await connectToMongoDB();
  });

  it("Expect to find Summoner By Name", async () => {
    const summonerName: string = "forevermates";

    const summoner: Summoner | null = await findSummonerByName(summonerName);

    expect(summoner).not.toBeNull();

    expect(summoner).toEqual(
      expect.objectContaining({
        _id: expect.anything(),
        name: summonerName,
        matchList: expect.arrayContaining([expect.any(String)]),
        puuid: expect.any(String),
        tabisCount: expect.any(Number),
        summonerLevel: expect.any(Number),
      })
    );
  });

  it("Expect to find Summoner By PUUID", async () => {
    const summonerPUUID: string = "tep5qDEJjHDwq81f6gxcwDc4V_G46emxRwZzXiNhKI0NWnKe4IZ0B6MCj6aMl2UplKs0haX4f-xTnA";
    const summonerName = "forevermates";

    const summoner: Summoner | null = await findSummonerByPUUID(summonerPUUID);

    expect(summoner).not.toBeNull();

    expect(summoner).toEqual(
      expect.objectContaining({
        _id: expect.anything(),
        puuid: summonerPUUID,
        name: summonerName,
        matchList: expect.arrayContaining([expect.any(String)]),
        tabisCount: expect.any(Number),
        summonerLevel: expect.any(Number),
      })
    );
  });

  it("Expect to find Summoner By ID", async () => {
    const summonerId: string = "ngQJmMrTc_zbLR8vXHAJmKJo1OmmJXP1ncWZPm_iRUJRdnM";
    const summonerName = "forevermates";

    const summoner: Summoner | null = await findSummonerByID(summonerId);

    expect(summoner).not.toBeNull();

    expect(summoner).toEqual(
      expect.objectContaining({
        _id: summonerId,
        name: summonerName,
        matchList: expect.arrayContaining([expect.any(String)]),
        tabisCount: expect.any(Number),
        summonerLevel: expect.any(Number),
      })
    );
  });
});
