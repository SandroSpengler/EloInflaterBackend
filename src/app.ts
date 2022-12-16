import express, { Application } from "express";
import path from "path";

import cors from "cors";
import * as winston from "winston";

// import {config} from "./Config/config";
require("dotenv").config();

import { connectToMongoDB } from "./MongoDB/mongodb";
import { Scheduler } from "./Services/Schedule/schedule";
import { swaggerSetup } from "./Services/Swagger/swagger";
import { createWinstonLoggerWithLoggly } from "./Services/Winston/winston";

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const matchController = require("./Route/Api/Data/Match");
const leaugeController = require("./Route/Api/Data/SummonerByRank");
const summonerController = require("./Route/Api/Data/SummonerData");
const summonerRefreshController = require("./Route/Api/Refresh/SummonerRefresh");
const matchRefreshController = require("./Route/Api/Refresh/MatchRefresh");

const schedule: Scheduler = new Scheduler();

const setupApp = async (): Promise<Application> => {
	const APP: Application = express();

	APP.use(
		cors({
			origin: "*",
		}),
	);

	APP.use(express.static(path.join(__dirname, "public")));

	APP.use("/api/data/summoner", jsonParser, summonerController);
	APP.use("/api/data/league", jsonParser, leaugeController);
	APP.use("/api/data/match", jsonParser, matchController);
	APP.use("/api/refresh/summoner", jsonParser, summonerRefreshController);
	APP.use("/api/refresh/match", jsonParser, matchRefreshController);

	/**
	 * start and setup of the Application
	 */
	if (process.env.NODE_ENV !== "test") {
		try {
			createWinstonLoggerWithLoggly(process.env.LOGGLY_TOKEN);

			console.log(`0: Setup Winston logger`);
		} catch (error) {
			console.error(`Could not Setup Winston logger`);
		}

		try {
			swaggerSetup(APP, 1337);

			winston.log("info", `Swagger has been setup`);
		} catch (error) {
			winston.error(`Could not Setup Swagger`);
		}

		APP.listen(1337, () => {
			console.log(`0: Server is running on PORT: 1337`);
		});

		connectToMongoDB(process.env.DB_CONNECTION).then(
			() => {},
			() => {
				winston.error("error", `Could not connect to MongoDB`);
				console.error("error", `Could not connect to MongoDB`);
			},
		);
	}
	if (process.env.RUN_JOB === "stop") {
		console.log("0: Not running any background jobs");
		winston.log("info", `Not running any background jobs`);
	}

	if (process.env.NODE_ENV !== "test" && process.env.RUN_JOB === "start") {
		console.log("starting");
		winston.log("info", `starting`);

		schedule.schedule();
	}

	return APP;
};

const startedApp = setupApp();

export { startedApp };
