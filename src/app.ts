// const express = require("express");
import { Application, Request, Response, NextFunction } from "express";
import express from "express";

import { ConnectionOptions } from "tls";

import * as winston from "winston";
import { format } from "winston";
const { combine, timestamp, label, printf } = format;

import { Loggly } from "winston-loggly-bulk";

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

// const mongoose = require("mongoose");
import { connect } from "mongoose";
import axios from "axios";
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

  try {
    const connectionOption: ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectionOptions;

    await connect(connection, connectionOption);

    console.log("0. Connected to MongoDB");
    await winston.log("info", `Connected to MongoDB`);
  } catch (error) {
    console.log(error);
  }
};

connectToMongoDB(process.env.DB_CONNECTION);

const createLoggerWithLoggly = async (token: string | undefined) => {
  if (token === undefined) {
    throw new Error("No Loggly token was provided");
  }

  try {
    const LogglyLogger: Loggly = new Loggly({
      token: process.env.LOGGLY_TOKEN,
      subdomain: "eloinflater",
      tags: ["Node-JS", process.env.NODE_ENV],
      json: true,
    });

    const myFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    });

    const FileLogger = winston.createLogger({
      transports: [new winston.transports.File({ filename: "Logs/Global.log" })],
      format: combine(
        label({
          label: "EloInflater",
        }),
        timestamp(),
        myFormat,
      ),
    });

    winston.add(LogglyLogger);
    winston.add(FileLogger);

    await winston.log("info", "Loggly created");
  } catch (error) {
    console.log(error);
  }
};

createLoggerWithLoggly(process.env.LOGGLY_TOKEN);

if (process.env.NODE_ENV !== "test") {
  APP.listen(config.PORT, () => {
    console.log("1. Server is running!!!");
  });
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
        winston.error("error", error.message);
        console.error(error.message);
      }
    }
  } finally {
    await setTimeout(() => {
      winston.log("info", `Cycle done - Restarting`);

      schedule();
    }, 2 * 15 * 1000);
  }
};

const updateSbLCollections = async () => {
  const SbLChallenger = await SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

  const SbLGrandMaster = await SbLRepo.findSummonerByLeague("GRANDMASTER", "RANKED_SOLO_5x5");

  const SbLMaster = await SbLRepo.findSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

  if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLChallenger)) {
    winston.log("info", `Updating SummonerByLeague ${SbLChallenger.tier} Collection`);

    const newSbLChallenger = (await RGHttp.getSummonersByLeague("CHALLENGER", "RANKED_SOLO_5x5")).data;

    await SbLRepo.updateSummonerByLeauge(newSbLChallenger);
    await summonerService.updateSumonersByLeague(newSbLChallenger);

    winston.log("info", `SummonerByLeague ${SbLChallenger.tier} - Done`);
  }

  if (SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLGrandMaster)) {
    winston.log("info", `Updating SummonerByLeague ${SbLGrandMaster.tier} Collection`);

    const newSbLGrandMaster = (await RGHttp.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5")).data;

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

  const allSummoners = [...SummonerRankChallenger, ...SummonerRankGrandMaster, ...SummonerRankMaster];

  try {
    for (let [index, summoner] of allSummoners.entries()) {
      if (summoner.puuid === "" || summoner._id === "" || summoner.accountId === "") {
        winston.log(
          "info",
          `validating summonerId for Summoner ${summoner.name} at ${index + 1} of ${allSummoners.length}`,
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

  const allSummoners = [...SummonerRankChallenger, ...SummonerRankGrandMaster, ...SummonerRankMaster];

  const updateAbleSummoners = allSummoners.filter((summoner) => {
    if (summonerService.checkIfSummonerCanBeUpdated(summoner)) {
      return summoner;
    }
  });

  try {
    for (let [index, summoner] of updateAbleSummoners.entries()) {
      winston.log(
        "info",
        `Updating Summoner matches for ${summoner.name} at ${index + 1} of ${updateAbleSummoners.length}`,
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
  console.log("Not running any background jobs");
  winston.log("info", `Not running any background jobs`);
}

export { APP, connectToMongoDB };
