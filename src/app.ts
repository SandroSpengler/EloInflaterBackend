import { Application, Request, Response } from "express";
import express from "express";

import axios from "axios";

import * as winston from "winston";

const cors = require("cors");
require("dotenv").config();

import { config } from "./Config/config";

import { RiotGamesHttp } from "./Services/Http";
import { SummonerRepository } from "./Repository/SummonerRepository";
import { SummonerByLeagueRepository } from "./Repository/SummonerByLeagueRepository";
import { MatchRepository } from "./Repository/MatchRepository";

import { SummonerService } from "./Services/SummonerService";
import { SummonerByLeagueService } from "./Services/SummonerByLeagueService";
import { DataMiningService } from "./Services/DataMiningService";
import { MatchService } from "./Services/MatchService";
import { swaggerSetup } from "./Swagger/swagger";
import { createWinstonLoggerWithLoggly } from "./Winston/winston";
import { connectToMongoDB } from "./MongoDB/mongodb";

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const APP: Application = express();

const summonerController = require("./Route/Api/Data/SummonerData");
const leaugeController = require("./Route/Api/Data/SummonerByRank");
const matchController = require("./Route/Api/Data/Match");
const summonerRefreshController = require("./Route/Api/Refresh/SummonerRefresh");
const matchRefreshController = require("./Route/Api/Refresh/MatchRefresh");

const RGHttp = new RiotGamesHttp();

const summonerRepo = new SummonerRepository();
const summonerService = new SummonerService(summonerRepo, RGHttp);

const SbLRepo = new SummonerByLeagueRepository();
const SbLService = new SummonerByLeagueService(SbLRepo, summonerRepo, RGHttp);

const matchRepo = new MatchRepository();
const matchService = new MatchService(matchRepo, RGHttp);

const dataMiningService = new DataMiningService(summonerRepo, RGHttp, matchRepo, matchService);

APP.use(
  cors({
    origin: "*",
  }),
);

APP.get("/", (req: Request, res: Response) => {
  res.send("<h1>Main Page!!</h1>");
});

APP.use("/api/data/summoner", jsonParser, summonerController);
APP.use("/api/data/league", jsonParser, leaugeController);
APP.use("/api/data/match", jsonParser, matchController);
APP.use("/api/refresh/summoner", jsonParser, summonerRefreshController);
APP.use("/api/refresh/match", jsonParser, matchRefreshController);

/**
 * start and setup of the Application
 */
if (process.env.NODE_ENV !== "test") {
  try {
    createWinstonLoggerWithLoggly(config.LOGGLY_TOKEN);

    console.log(`0: Setup Winston logger`);
  } catch (error) {
    console.error(`Could not Setup Winston logger`);
  }
  try {
    swaggerSetup(APP, config.PORT);

    winston.log("info", `Swagger has been setup`);
  } catch (error) {
    winston.error(`Could not Setup Swagger`);
  }

  APP.listen(config.PORT, () => {
    console.log(`0: Server is running on PORT:${config.PORT}`);
  });

  try {
    connectToMongoDB(config.DB_CONNECTION);

    winston.log("info", `Connected to MongoDB`);
  } catch (error) {
    winston.error("error", `Could not connect to MongoDB`);
  }
}

const schedule = async () => {
  try {
    await updateSbLCollections();

    await validateSummonerInSbLCollection();

    await addNewMatches();
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        winston.log("warn", `Rate Limit:  ${error.message}`);
        console.error(error.message);
      } else {
        winston.log("error", error.message);
        console.log(error.message);
      }
    }
  } finally {
    await setTimeout(() => {
      winston.log("info", `Cycle done - Restarting`);

      schedule();
    }, 2 * 15 * 1000);
  }
};

// ToDo
// Move this somewhere more pleasant
const updateSbLCollections = async () => {
  const SbLChallenger = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

  const SbLGrandMaster = await SbLRepo.findSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

  const SbLMaster = await SbLRepo.findSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

  if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLChallenger)) {
    winston.log("info", `Updating SummonerByLeague ${SbLChallenger.tier} Collection`);

    const newSbLChallenger = (await RGHttp.getSummonersByLeague("CHALLENGER", "RANKED_SOLO_5x5"))
      .data;

    await SbLRepo.updateSummonerByLeauge(newSbLChallenger);
    await summonerService.updateSumonersByLeague(newSbLChallenger);

    winston.log("info", `SummonerByLeague ${SbLChallenger.tier} - Done`);
  }

  if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLGrandMaster)) {
    winston.log("info", `Updating SummonerByLeague ${SbLGrandMaster.tier} Collection`);

    const newSbLGrandMaster = (await RGHttp.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5"))
      .data;

    await SbLRepo.updateSummonerByLeauge(newSbLGrandMaster);
    await summonerService.updateSumonersByLeague(newSbLGrandMaster);

    winston.log("info", `SummonerByLeague ${SbLGrandMaster.tier} - Done`);
  }

  if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLMaster)) {
    winston.log("info", `Updating SummonerByLeague ${SbLMaster.tier} Collection`);

    const newSbLMaster = (await RGHttp.getSummonersByLeague("MASTER", "RANKED_SOLO_5x5")).data;

    await SbLRepo.updateSummonerByLeauge(newSbLMaster);
    await summonerService.updateSumonersByLeague(newSbLMaster);

    winston.log("info", `SummonerByLeague ${SbLMaster.tier} - Done`);
  }

  winston.log("info", `updating SbLCollections finished`);
};

const validateSummonerInSbLCollection = async () => {
  const SummonerRankChallenger = await summonerRepo.findAllSummonersByRank("CHALLENGER");

  const SummonerRankGrandMaster = await summonerRepo.findAllSummonersByRank("GRANDMASTER");

  const SummonerRankMaster = await summonerRepo.findAllSummonersByRank("MASTER");

  const allSummoners = [
    ...SummonerRankChallenger,
    ...SummonerRankGrandMaster,
    ...SummonerRankMaster,
  ];

  try {
    for (let [index, summoner] of allSummoners.entries()) {
      if (summoner.puuid === "" || summoner._id === "" || summoner.accountId === "") {
        winston.log(
          "info",
          `validating summonerId for Summoner ${summoner.name} at ${index + 1} of ${
            allSummoners.length
          }`,
        );

        await summonerService.validateSummonerById(summoner._id);
      }
    }
  } catch (error) {
    throw error;
  }

  winston.log("info", `validating SbLCollection finished`);
};

const addNewMatches = async () => {
  const SummonerRankChallenger = await summonerRepo.findAllSummonersByRank("CHALLENGER");

  const SummonerRankGrandMaster = await summonerRepo.findAllSummonersByRank("GRANDMASTER");

  const SummonerRankMaster = await summonerRepo.findAllSummonersByRank("MASTER");

  const allSummoners = [
    ...SummonerRankChallenger,
    ...SummonerRankGrandMaster,
    ...SummonerRankMaster,
  ];

  const updateAbleSummoners = allSummoners.filter((summoner) => {
    if (summonerService.checkIfSummonerMatchesCanBeUpdated(summoner)) {
      return summoner;
    }
  });

  try {
    for (let [index, summoner] of updateAbleSummoners.entries()) {
      winston.log(
        "info",
        `Updating Summoner matches for ${summoner.name} at ${index + 1} of ${
          updateAbleSummoners.length
        }`,
      );

      await dataMiningService.addNewMatchesToSummoner(summoner);
    }
  } catch (error) {
    throw error;
  }
};

if (process.env.NODE_ENV !== "test" && process.env.RUN_JOB === "start") {
  console.log("starting");
  winston.log("info", `starting`);
  schedule();
}
if (process.env.RUN_JOB === "stop") {
  console.log("0: Not running any background jobs");
  winston.log("info", `Not running any background jobs`);
}

export { APP };
