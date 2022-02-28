/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

// only change by Region
let protocol = "https://";
let regionUrl = "euw1.api.riotgames.com";
let genericUrl = "/lol/";

// changes for each endpoint
let enpointUrl = "";

const getPlayerByName = async (name) => {
  try {
    const request = axios.get(`${buildBaseUrl(regionUrl, "summoner/v4/summoners/by-name/")}${name}`, buildConfig());

    const response = await request;

    console.log(await response);
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
      "X-Riot-Token": localStorage.getItem("API_KEY"),
    },
  };

  return config;
};

export { getPlayerByName };
