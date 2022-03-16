// const express = require("express");
import { Application, Request, Response, NextFunction } from "express";
import * as express from "express";

import { ConnectionOptions } from "tls";
import { validateSummonerRanks } from "./Repository/SummonerRepository";

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
    .then((data) => console.log("connected to mongodb"))
    .catch((err) => {
      console.log(err.message);
    });
};

connectToMongoDB();

APP.listen(PORT, () => {
  console.log("Server is running");
});

cron.schedule("*/15 * * * * *", async () => {
  const updateList = ["CHALLENGER", "GRANDMASTER", "MASTER"];

  for (let i = 0; i < updateList.length; i++) {
    await validateSummonerRanks(updateList[i]);
  }

  // 1. Query current challengers gransmaster master from MongoDB
  // 2. Query current SummonersByLeague
  // 3. Check if SummonersByLeague are up to date (less than 24 hours old)
  // 4. Check if summoner is in SummonersByLeague
  // 5.1 -> Update summoner lp, wins, losses etc
  // 5.1 || Remove update summoner division
  // 6. Validate if Summoner has new Matches
  // 6.1 check if summoner.updatedAt less than date.now - 3 hours
  //     maybe summoner.matchlist lastestmatch less than date.now - 1 hour
  // 7. Call update Summoner Matches
  // Check if there are summoners that need to be updated
  // ? create logic for that
  // Get more than 100 matches
});
