// const express = require("express");
import { Application, Request, Response, NextFunction } from "express";
import * as express from "express";

require("dotenv").config();

const cors = require("cors");
const { PORT } = require("./Config/config");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const APP: Application = express();

const summonerController = require("./Route/Api/Summoner");
const leaugeController = require("./Route/Api/League");

APP.use(cors());

APP.get("/", (req: Request, res: Response) => {
  res.send("<h1>Main Page!</h1>");
});

APP.use("/api/summoner", jsonParser, summonerController);
APP.use("/api/league", jsonParser, leaugeController);

APP.listen(PORT, () => {
  console.log("Server is running");
});
