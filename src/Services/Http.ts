/* eslint-disable @typescript-eslint/no-unused-vars */
// const axios = require("axios");

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import SummonerByLeague, { EntriesByLeague } from "../Models/Interfaces/SummonerByLeague";
import Summoner from "../Models/Interfaces/Summoner";
import { MatchData } from "../Models/Interfaces/MatchData";
import { MatchList } from "../Models/Interfaces/MatchList";

export class RiotGamesHttp {
  // only change by Region
  protocol = "https://";
  regionUrl = "euw1.api.riotgames.com";
  matchRegionUrl = "europe.api.riotgames.com";
  genericUrl = "/lol/";

  // changes for each endpoint
  enpointUrl = "";

  public getSummonerByName = async (name: string): Promise<AxiosResponse<Summoner>> => {
    try {
      const request = axios.get<Summoner>(
        `${this.buildBaseUrl(this.regionUrl, "summoner/v4/summoners/by-name/")}${name}`,
        this.buildConfig(),
      );

      const response = await request;

      return await response;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  public getSummonerBySummonerId = async (id: string): Promise<AxiosResponse<Summoner>> => {
    try {
      const request = axios.get<Summoner>(
        `${this.buildBaseUrl(this.regionUrl, "summoner/v4/summoners/")}${id}`,
        this.buildConfig(),
      );

      const response = await request;

      return await response;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  public getSummonersByLeague = async (queueType, queueMode): Promise<AxiosResponse<SummonerByLeague>> => {
    let queueLeague = "";
    let queueModeDescription = "";

    if (queueType === "challenger") queueLeague = "challengerleagues";
    if (queueType === "grandmaster") queueLeague = "grandmasterleagues";
    if (queueType === "master") queueLeague = "masterleagues";

    if (queueMode === "rankedsolo") queueModeDescription = "RANKED_SOLO_5x5";
    if (queueMode === "flexsolo") queueModeDescription = "RANKED_FLEX_SR";
    if (queueMode === "flextt") queueModeDescription = "RANKED_FLEX_TT";

    try {
      const request = axios.get<SummonerByLeague>(
        `${this.buildBaseUrl(this.regionUrl, `league/v4/${queueLeague}/by-queue/`)}${queueModeDescription}`,
        this.buildConfig(),
      );

      const response = await request;

      // const summonersSortedByLp = await response.data.entries.sort((summoner1, summoner2) =>
      //   summoner1.leaguePoints > summoner2.leaguePoints ? -1 : 1
      // );

      return await response;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  public getMatchesIdsBySummonerpuuid = async (puuid: string): Promise<AxiosResponse<string[]>> => {
    try {
      const request = axios.get<string[]>(
        `${this.buildBaseUrl(this.matchRegionUrl, "match/v5/matches/by-puuid/")}${puuid}/ids?start=0&count=100`,
        this.buildConfig(),
      );

      const response = await request;

      return await response;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  public getMatchByMatchId = async (matchId: String): Promise<AxiosResponse<MatchData>> => {
    try {
      const request = axios.get<MatchData>(
        `${this.buildBaseUrl(this.matchRegionUrl, "match/v5/matches/")}${matchId}`,
        this.buildConfig(),
      );

      const response = await request;

      return await response;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  public buildBaseUrl = (regionUrl, endpointUrl) => {
    let completeUrl = `${this.protocol}${regionUrl}${this.genericUrl}${endpointUrl}`;

    return completeUrl;
  };

  public buildConfig = (): any => {
    let config = {
      headers: {
        "X-Riot-Token": process.env.API_KEY,
      },
    };

    return config;
  };
}
// module.exports = { getSummonerByName, getSummonersByLeague };
