"use strict";
exports.__esModule = true;
var express = require("express");
require("dotenv").config();
var cors = require("cors");
var PORT = require("./Config/config").PORT;
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var APP = express();
var summonerController = require("./Route/Api/Summoner");
var leaugeController = require("./Route/Api/League");
APP.use(cors());
APP.get("/", function (req, res) {
  res.send("<h1>Main Page!</h1>");
});
APP.use("/api/summoner", jsonParser, summonerController);
APP.use("/api/league", jsonParser, leaugeController);
APP.listen(PORT, function () {
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

  console.log("Server is running");
});
