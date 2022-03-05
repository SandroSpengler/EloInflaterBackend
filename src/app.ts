// const express = require("express");
import { Application, Request, Response, NextFunction } from "express";
import * as express from "express";

import { ConnectionOptions } from "tls";

const mongoose = require("mongoose");
const cors = require("cors");
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
