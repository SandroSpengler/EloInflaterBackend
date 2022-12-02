import {Application, Request, Response} from "express";
import express from "express";

import * as winston from "winston";

const cors = require("cors");

// import {config} from "./Config/config";

import {swaggerSetup} from "./Services/Swagger/swagger";
import {createWinstonLoggerWithLoggly} from "./Services/Winston/winston";
import {connectToMongoDB} from "./MongoDB/mongodb";
import {Scheduler} from "./Services/Schedule/schedule";

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const summonerController = require("./Route/Api/Data/SummonerData");
const leaugeController = require("./Route/Api/Data/SummonerByRank");
const matchController = require("./Route/Api/Data/Match");
const summonerRefreshController = require("./Route/Api/Refresh/SummonerRefresh");
const matchRefreshController = require("./Route/Api/Refresh/MatchRefresh");

const APP: Application = express();

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

const schedule: Scheduler = new Scheduler();

/**
 * start and setup of the Application
 */
if (process.env.NODE_ENV !== "test") {
  require("dotenv").config();
  try {
    createWinstonLoggerWithLoggly(process.env.LOGGLY_TOKEN);

    console.log(`0: Setup Winston logger`);
  } catch (error) {
    console.error(`Could not Setup Winston logger`);
  }
  try {
    swaggerSetup(APP, Number(process.env.PORT));

    winston.log("info", `Swagger has been setup`);
  } catch (error) {
    winston.error(`Could not Setup Swagger`);
  }

  APP.listen(process.env.PORT, () => {
    console.log(`0: Server is running on PORT:${process.env.PORT}`);
  });

  connectToMongoDB(process.env.DB_CONNECTION).then(
    () => {},
    () => {
      winston.error("error", `Could not connect to MongoDB`);
      console.error("error", `Could not connect to MongoDB`);
    },
  );
}

if (process.env.NODE_ENV !== "test" && process.env.RUN_JOB === "start") {
  console.log("starting");
  winston.log("info", `starting`);
  schedule.schedule();
}
if (process.env.RUN_JOB === "stop") {
  console.log("0: Not running any background jobs");
  winston.log("info", `Not running any background jobs`);
}

export {APP};
