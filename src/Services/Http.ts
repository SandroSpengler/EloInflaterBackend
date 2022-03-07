/* eslint-disable @typescript-eslint/no-unused-vars */
// const axios = require("axios");

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import SummonerByLeague, { EntriesByLeague } from "../Models/Interfaces/SummonerByLeague";
import Summoner from "../Models/Interfaces/Summoner";

// only change by Region
let protocol = "https://";
let regionUrl = "euw1.api.riotgames.com";
let genericUrl = "/lol/";

// changes for each endpoint
let enpointUrl = "";

export const getSummonerByName = async (name): Promise<AxiosResponse<Summoner>> => {
  try {
    const request = axios.get<Summoner>(
      `${buildBaseUrl(regionUrl, "summoner/v4/summoners/by-name/")}${name}`,
      buildConfig()
    );

    const response = await request;

    return await response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSummonersByLeague = async (queueType, queueMode): Promise<AxiosResponse<SummonerByLeague>> => {
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
      `${buildBaseUrl(regionUrl, `league/v4/${queueLeague}/by-queue/`)}${queueModeDescription}`,
      buildConfig()
    );

    const response = await request;

    // const summonersSortedByLp = await response.data.entries.sort((summoner1, summoner2) =>
    //   summoner1.leaguePoints > summoner2.leaguePoints ? -1 : 1
    // );

    return await response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const buildBaseUrl = (regionUrl, endpointUrl) => {
  let completeUrl = `${protocol}${regionUrl}${genericUrl}${endpointUrl}`;

  return completeUrl;
};

const buildConfig = (): any => {
  let config = {
    headers: {
      "X-Riot-Token": process.env.API_KEY,
    },
  };

  return config;
};

// module.exports = { getSummonerByName, getSummonersByLeague };
