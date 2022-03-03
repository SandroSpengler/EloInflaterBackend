const express = require("express");

require("dotenv").config();

const cors = require("cors");
const { PORT } = require("./Config/config");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const APP = express();

const summonerController = require("./Route/Api/Summoner");
const leaugeController = require("./Route/Api/League");

APP.use(cors());

APP.get("/", (req, res) => {
  res.send("<h1>Main Page</h1>");
});

APP.use("/api/summoner", jsonParser, summonerController);
APP.use("/api/league", jsonParser, leaugeController);

APP.listen(PORT, () => {
  console.log("Server is running");
});
