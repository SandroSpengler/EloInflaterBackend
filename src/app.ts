// const express = require("express");
import { Application, Request, Response, NextFunction } from "express";
import express from "express";

import { ConnectionOptions } from "tls";

import axios, { AxiosError } from "axios";

import { config } from "./Config/config";
import { SummonerRepository } from "./Repository/SummonerRepository";
import { SummonerService } from "./Services/SummonerService";
import { RiotGamesHttp } from "./Services/Http";
import { SummonerByLeagueRepository } from "./Repository/SummonerByLeagueRepository";
import { SummonerByLeagueService } from "./Services/SummonerByLeagueService";
import Summoner from "./Models/Interfaces/Summoner";
import { DataMiningService } from "./Services/DataMiningService";
import { MatchRepository } from "./Repository/MatchRepository";
import { MatchService } from "./Services/MatchService";

const mongoose = require("mongoose");
const cors = require("cors");
// const cron = require("node-cron");

require("dotenv").config();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const APP: Application = express();

const summonerController = require("./Route/Api/Data/SummonerData");
const leaugeController = require("./Route/Api/Data/SummonerByLeagueData");
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

let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
};

APP.use(
  cors({
    origin: "*",
  }),
);

/**
 * Default entry Point for the App
 */
APP.get("/", (req: Request, res: Response) => {
  res.send("<h1>Main Page!!</h1>");
});

APP.use("/api/data/summoner", jsonParser, summonerController);
APP.use("/api/data/league", jsonParser, leaugeController);
APP.use("/api/data/match", jsonParser, matchController);
APP.use("/api/refresh/summoner", jsonParser, summonerRefreshController);
APP.use("/api/refresh/match", jsonParser, matchRefreshController);

/**
 * Connects to the MongoDB
 *
 * @param connection String used to connect to MongoDB
 */
const connectToMongoDB = async (connection: string | undefined) => {
  if (connection === undefined) {
    throw new Error("No Connection String was provided");
  }

  await mongoose
    .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectionOptions)
    .then((data) => {
      if (process.env.NODE_ENV !== "test") {
        console.log("0. connected to mongodb");
      }
    })

    .catch((err) => {
      // console.log(err.message);
    });
};

connectToMongoDB(process.env.DB_CONNECTION);

if (process.env.NODE_ENV !== "test") {
  APP.listen(config.PORT, () => {
    console.log("0. Server is running");
  });
}

const schedule = async () => {
  try {
    // Go through all SummonerByLeague and update their MatchList
    // await checkSummonerMatchIdLists();

    console.group("Updating SbL");
    await updateSbLCollections();
    console.groupEnd();

    console.group("Validation");
    await validateSummonerInSbLCollection();
    console.groupEnd();

    // Get new Matches for Summoner
    // Check at the same time for unassigned ones

    console.group("Matches");
    await addNewMatches();
    console.groupEnd();
  } catch (error: any) {
    console.error(error.message);
  } finally {
    await setTimeout(() => {
      console.log("Cycle done - Restarting");

      schedule();
    }, 2 * 15 * 1000);
  }
};

const updateSbLCollections = async () => {
  const SbLChallenger = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

  const SbLGrandMaster = await SbLRepo.findSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

  const SbLMaster = await SbLRepo.findSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

  if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLChallenger)) {
    console.log(`Updating SummonerByLeague ${SbLChallenger.tier} Collection`);

    const newSbLChallenger = (await RGHttp.getSummonersByLeague("CHALLENGER", "RANKED_SOLO_5x5")).data;

    await SbLRepo.updateSummonerByLeauge(newSbLChallenger);
    await summonerService.updateSumonersByLeague(newSbLChallenger);

    console.log(` SummonerByLeague ${SbLChallenger.tier} - Done`);
  }

  if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLGrandMaster)) {
    console.log(`Updating SummonerByLeague ${SbLGrandMaster.tier} Collection`);

    const newSbLGrandMaster = (await RGHttp.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5")).data;

    await SbLRepo.updateSummonerByLeauge(newSbLGrandMaster);
    await summonerService.updateSumonersByLeague(newSbLGrandMaster);

    console.log(` SummonerByLeague ${SbLGrandMaster.tier} - Done`);
  }

  if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLMaster)) {
    console.log(`Updating SummonerByLeague ${SbLMaster.tier} Collection`);

    const newSbLMaster = (await RGHttp.getSummonersByLeague("MASTER", "RANKED_SOLO_5x5")).data;

    await SbLRepo.updateSummonerByLeauge(newSbLMaster);
    await summonerService.updateSumonersByLeague(newSbLMaster);

    console.log(` SummonerByLeague ${SbLMaster.tier} - Done`);
  }

  console.log("updating SbLCollections finished");
};

const validateSummonerInSbLCollection = async () => {
  const SummonerRankChallenger = await summonerRepo.findAllSummonersByRank("CHALLENGER");

  const SummonerRankGrandMaster = await summonerRepo.findAllSummonersByRank("GRANDMASTER");

  const SummonerRankMaster = await summonerRepo.findAllSummonersByRank("MASTER");

  const allSummoners = [...SummonerRankChallenger, ...SummonerRankGrandMaster, ...SummonerRankMaster];

  try {
    for (let [index, summoner] of allSummoners.entries()) {
      if (summoner.puuid === "" || summoner._id === "" || summoner.accountId === "") {
        const informationString: string = `validating summonerId for Summoner ${summoner.name} at ${index} of ${allSummoners.length}`;

        console.log(informationString);

        await summonerService.validateSummonerById(summoner._id);
      }
    }
  } catch (error) {
    throw error;
  }

  console.log("validating SbLCollection finished");
};

const addNewMatches = async () => {
  const SummonerRankChallenger = await summonerRepo.findAllSummonersByRank("CHALLENGER");

  const SummonerRankGrandMaster = await summonerRepo.findAllSummonersByRank("GRANDMASTER");

  const SummonerRankMaster = await summonerRepo.findAllSummonersByRank("MASTER");

  const allSummoners = [...SummonerRankChallenger, ...SummonerRankGrandMaster, ...SummonerRankMaster];

  try {
    for (let [index, summoner] of allSummoners.entries()) {
      if (summonerService.checkIfSummonerCanBeUpdated(summoner)) {
        const informationString: string = `Updating Summoner matches for ${summoner.name} at ${index} of ${allSummoners.length}`;

        console.log(informationString);

        await dataMiningService.addNewMatchesToSummoner(summoner);
      }
    }
  } catch (error) {
    throw error;
  }
};

if (process.env.NODE_ENV !== "test" && process.env.RUN_JOB === "start") {
  console.log("starting");
  schedule();
}
if (process.env.RUN_JOB === "stop") {
  console.log("Not running any background jobs");
}

export { APP, connectToMongoDB };
