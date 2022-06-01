// const express = require("express");
import { Application, Request, Response, NextFunction } from "express";
import express from "express";

import { ConnectionOptions } from "tls";
import { validateSummonerIds, validateSummonerLeague } from "./Repository/SummonerRepository";
import axios, { AxiosError } from "axios";
import { checkForNewSummonerMatches, checkSummonerMatchIdLists } from "./Repository/DataMiningRepository";

const mongoose = require("mongoose");
const cors = require("cors");
// const cron = require("node-cron");

const { PORT, DB_CONNECTION } = require("./Config/config");

require("dotenv").config();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const APP: Application = express();

const summonerController = require("./Route/Api/Data/SummonerData");
const leaugeController = require("./Route/Api/Data/SummonerByLeagueData");
const matchController = require("./Route/Api/Data/Match");
const summonerRefreshController = require("./Route/Api/Refresh/SummonerRefresh");
const matchRefreshController = require("./Route/Api/Refresh/MatchRefresh");

let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
};

APP.use(
  cors({
    origin: "*",
  })
);

APP.get("/", (req: Request, res: Response) => {
  res.send("<h1>Main Page!!</h1>");
});

APP.use("/api/data/summoner", jsonParser, summonerController);
APP.use("/api/data/league", jsonParser, leaugeController);
APP.use("/api/data/match", jsonParser, matchController);
APP.use("/api/refresh/summoner", jsonParser, summonerRefreshController);
APP.use("/api/refresh/match", jsonParser, matchRefreshController);

const connectToMongoDB = async () => {
  await mongoose
    .connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectionOptions)
    .then((data) => {
      if (process.env.NODE_ENV !== "test") {
        console.log("0. connected to mongodb");
      }
    })

    .catch((err) => {
      // console.log(err.message);
    });
};

connectToMongoDB();

if (process.env.NODE_ENV !== "test") {
  APP.listen(PORT, () => {
    console.log("0. Server is running");
  });
}
const schedule = async () => {
  try {
    // await checkSummonerMatchIdLists();

    await validateSummonerIds("CHALLENGER");
    await validateSummonerIds("GRANDMASTER");
    await validateSummonerIds("MASTER");

    await validateSummonerLeague("CHALLENGER");
    await validateSummonerLeague("GRANDMASTER");
    await validateSummonerLeague("MASTER");

    await checkForNewSummonerMatches("CHALLENGER");
    await checkForNewSummonerMatches("GRANDMASTER");
    await checkForNewSummonerMatches("MASTER");

    await setTimeout(function () {
      console.log("Going to restart");
      schedule();
    }, 1000 * 90);
  } catch (error: any) {
    console.log(error.message);
  }
};

if (process.env.RUN_JOB === "start") {
  schedule();
  console.log("starting");
}
if (process.env.RUN_JOB === "stop") {
  // console.log("0. not running any background jobs");
}

export { APP, connectToMongoDB };
