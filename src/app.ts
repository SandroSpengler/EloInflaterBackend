// const express = require("express");
import { Application, Request, Response, NextFunction } from "express";
import * as express from "express";

import { ConnectionOptions } from "tls";
import {
  updateQueuedSummoners,
  updatSummonerMatches,
  validateSummonerIds,
  validateSummonerLeague,
} from "./Repository/SummonerRepository";
import axios, { AxiosError } from "axios";

const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

const { PORT, DB_CONNECTION } = require("./Config/config");

require("dotenv").config();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const APP: Application = express();

const summonerController = require("./Route/Api/Data/SummonerData");
const leaugeController = require("./Route/Api/Data/SummonerByLeagueData");
const summonerRefreshController = require("./Route/Api/Refresh/SummonerRefresh");

APP.use(cors());

APP.get("/", (req: Request, res: Response) => {
  res.send("<h1>Main Page!!</h1>");
});

APP.use("/api/data/summoner", jsonParser, summonerController);
APP.use("/api/data/league", jsonParser, leaugeController);
APP.use("/api/refresh/summoner", jsonParser, summonerRefreshController);

const connectToMongoDB = () => {
  mongoose
    .connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectionOptions)
    .then((data) => {
      console.log("0. connected to mongodb");
    })

    .catch((err) => {
      console.log(err.message);
    });
};

connectToMongoDB();

APP.listen(PORT, () => {
  console.log("0. Server is running");
});

const schedule = async () => {
  try {
    await validateSummonerIds("CHALLENGER");
    await validateSummonerIds("GRANDMASTER");
    // await validateSummonerIds("MASTER");

    await validateSummonerLeague("CHALLENGER");
    await validateSummonerLeague("GRANDMASTER");
    // await validateSummonerLeague("MASTER");

    await updateQueuedSummoners("CHALLENGER");
    await updateQueuedSummoners("GRANDMASTER");

    await setTimeout(function () {
      console.log("Going to restart");
      schedule();
    }, 1000 * 60 * 2);
  } catch (error) {
    console.log(error);
  }
};

if (process.env.RUN_JOB === "start") {
  schedule();
  console.log("starting");
}
if (process.env.RUN_JOB === "stop") {
  console.log("0. not running any background jobs");
}
