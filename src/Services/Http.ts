/* eslint-disable @typescript-eslint/no-unused-vars */
// const axios = require("axios");

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Entry, League } from "../Models/Interfaces/SummonerByLeague";
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

export const getSummonersByLeague = async (queueLeague, queueModeDescription): Promise<Entry[]> => {
  try {
    const request = axios.get<League>(
      `${buildBaseUrl(regionUrl, `league/v4/${queueLeague}/by-queue/`)}${queueModeDescription}`,
      buildConfig()
    );

    const response = await request;

    const summonersSortedByLp = await response.data.entries.sort((summoner1, summoner2) =>
      summoner1.leaguePoints > summoner2.leaguePoints ? -1 : 1
    );

    return await summonersSortedByLp;
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
