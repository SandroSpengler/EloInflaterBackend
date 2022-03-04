"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    console.log("Server is running");
});
