import { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import { ValidateError } from "tsoa";

import { BadRequest, Conflict } from "../Models/Interfaces/Error/Http4xx";
import HttpError from "../Models/Interfaces/Error/HttpError";

import * as winston from "winston";
import { AxiosError } from "axios";

export class ErrorService {
	public determineError(
		err: any,
		req: ExRequest,
		res: ExResponse,
		next: NextFunction,
	): ExResponse | void {
		if (err instanceof HttpError) {
			try {
				return this.handeHttpControllerError(err, res);
			} catch (error) {
				return res.status(500).json({
					message: error,
				});
			}
		}

		if (err instanceof AxiosError) {
			try {
				return this.handeAxiosError(err, res);
			} catch (error) {
				return res.status(500).json({
					message: error,
				});
			}
		}

		if (err instanceof ValidateError) {
			console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
			return res.status(422).json({
				message: "Validation Failed",
				details: err?.fields,
			});
		}

		if (err instanceof Error) {
			console.error(err);
			winston.error("error", `${JSON.stringify(err)}`);
			return res.status(500).json({
				message: "Internal Server Error",
			});
		}

		next();
	}

	public handeHttpControllerError(err: HttpError, res: ExResponse): ExResponse {
		return res.status(err.httpStatusCode).json({
			name: "Http Error",
			message: err.message,
			stack: "Webcontroller",
			httpStatusCode: err.httpStatusCode,
		});
	}

	public handeAxiosError(err: AxiosError, res: ExResponse): ExResponse {
		if (err.response?.status === 403) {
			return res.status(Number(err.response?.status)).json({
				name: "Axios Error",
				message: "api-key expired",
				stack: "Riot Games Api",
				httpStatusCode: err.response?.status,
			});
		}
		if (err.response?.status === 404) {
			return res.status(Number(err.response?.status)).json({
				name: "Axios Error",
				message: "Summoner could not be found",
				stack: "Riot Games Api",
				httpStatusCode: err.response?.status,
			});
		}
		if (err.response?.status === 429) {
			return res.status(Number(err.response?.status)).json({
				name: "Axios Error",
				message: "Too many requests",
				stack: "Riot Games Api",
				httpStatusCode: err.response?.status,
			});
		}

		throw new Error("internal server error");
	}
}
