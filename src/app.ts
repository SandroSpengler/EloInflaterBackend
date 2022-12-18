import express, { Application, json, urlencoded } from "express";
import { Response as ExResponse, Request as ExRequest, NextFunction } from "express";

import path from "path";

import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../build/routes";

import cors from "cors";
import * as winston from "winston";

require("dotenv").config();

import { connectToMongoDB } from "./MongoDB/mongodb";
import { Scheduler } from "./Services/Schedule/schedule";

import { createWinstonLoggerWithLoggly } from "./Services/Winston/winston";
import { ErrorService } from "./Services/ErrorService";

const schedule: Scheduler = new Scheduler();
const errorService: ErrorService = new ErrorService();

const setupApp = async (): Promise<Application> => {
	const APP: Application = express();

	APP.use(
		cors({
			origin: "*",
		}),
	);
	APP.use(
		urlencoded({
			extended: true,
		}),
	);

	APP.use(json());

	APP.use(express.static(path.join(__dirname, "Public")));

	RegisterRoutes(APP);

	APP.use((err: unknown, req: ExRequest, res: ExResponse, next: NextFunction) => {
		errorService.determineError(err, req, res, next);
	});

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
			APP.use("/swagger", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
				return res.send(swaggerUi.generateHTML(await import("../build/swagger.json")));
			});

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
	if (process.env.NODE_ENV !== "test" && process.env.RUN_JOB === "stop") {
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

setupApp();

export default setupApp;
