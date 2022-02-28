/* eslint-disable @typescript-eslint/no-unused-vars */
const axios = require("axios");

// only change by Region
let protocol = "https://";
let regionUrl = "euw1.api.riotgames.com";
let genericUrl = "/lol/";

// changes for each endpoint
let enpointUrl = "";

const getSummonerByName = async (name) => {
  try {
    const request = axios.get(`${buildBaseUrl(regionUrl, "summoner/v4/summoners/by-name/")}${name}`, buildConfig());

    const response = await request;

    return await response;
  } catch (error) {
    console.log(error);
  }
};

const buildBaseUrl = (regionUrl, endpointUrl) => {
  let completeUrl = `${protocol}${regionUrl}${genericUrl}${endpointUrl}`;

  return completeUrl;
};

const buildConfig = () => {
  let config = {
    headers: {
      "X-Riot-Token": process.env.API_KEY,
    },
  };

  return config;
};

module.exports = { getSummonerByName };
