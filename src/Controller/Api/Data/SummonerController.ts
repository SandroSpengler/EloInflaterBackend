import axios, { AxiosError, AxiosResponse } from "axios";

// import { Request, Response, Router } from "express";

import { SummonerRepository } from "../../../Repository/SummonerRepository";

import { RiotGamesHttp } from "../../../Services/HttpService";
import { SummonerService } from "../../../Services/SummonerService";

import { Controller, Get, Path, Query, Route, SuccessResponse, Response, Post } from "tsoa";
import { ISummoner } from "../../../Models/Interfaces/Summoner";
import { Conflict, NotFound } from "../../../Models/Interfaces/Error/Http4xx";
import HttpError from "../../../Models/Interfaces/Error/HttpError";
import { InternalServer } from "../../../Models/Interfaces/Error/Http5xx";

// const express = require("express");
// const router = express.Router();

// export class SummonerData {
// 	private RGHttp: RiotGamesHttp = new RiotGamesHttp();

// 	private summonerRepo: SummonerRepository = new SummonerRepository();
// 	private summonerService: SummonerService = new SummonerService(this.summonerRepo, this.RGHttp);

// 	constructor() {
// 		router.get("/", this.getAllSummoner);
// 		router.get("/:name", this.getSummonerByName);
// 	}

// 	public getAllSummoner = async (req, res) => {
// 		if (process.env.NODE_ENV && process.env.NODE_ENV == "development") {
// 			const allSummoners = await this.summonerRepo.findAllSummoners();

// 			return res.status(200).json({ allSummoners });
// 		}
// 		return res.status(409).send();
// 	};

// 	public getSummonerByName = async (req: Request, res: Response) => {
// 		if (req.params.name === undefined || req.params.name === "") {
// 			return res.status(400).send();
// 		}

// 		let queryName = req.params.name;

// 		try {
// 			// Search by PUUID and by Name to get 1 less request

// 			let summonerInDB = await this.summonerRepo.findSummonerByName(req.params.name);

// 			if (summonerInDB != null) {
// 				return res.status(200).json(formatSummonerForSending(summonerInDB));
// 			} else {
// 				let getsummonerBynameResponse = await this.RGHttp.getSummonerByName(queryName);

// 				if (getsummonerBynameResponse.status === 200) {
// 					await this.summonerRepo.createSummoner(getsummonerBynameResponse.data);

// 					let summonerCreated = await this.summonerRepo.findSummonerByName(
// 						getsummonerBynameResponse.data.name,
// 					);

// 					if (summonerCreated === null) throw new Error("Summoner could ot be created");

// 					return res.status(280).json(formatSummonerForSending(summonerCreated));
// 				}
// 			}

// 			return res.status(404).send();
// 		} catch (error: any) {
// 			if (axios.isAxiosError(error)) {
// 				let axiosError: AxiosError = error;

// 				if (axiosError.response?.status === 403) {
// 					return res.status(403).send();
// 				}

// 				if (axiosError.response?.status === 404) {
// 					return res.status(404).send();
// 				}

// 				if (axiosError.response?.status === 429) {
// 					return res.status(429).send();
// 				}
// 			}

// 			return res.status(500).send({ error: error.message });
// 		}
// 	};
// }

// new SummonerData();

// module.exports = router;

@Route("api/data/summoner")
export class SummonerController extends Controller {
	public summonerRepo: SummonerRepository;
	public summonerService: SummonerService;

	public RGHttpClient: RiotGamesHttp;

	constructor() {
		super();

		this.RGHttpClient = new RiotGamesHttp();

		this.summonerRepo = new SummonerRepository();

		this.summonerService = new SummonerService(this.summonerRepo, this.RGHttpClient);
	}

	@Get("")
	@SuccessResponse("200")
	@Response<HttpError>("409", "Not a development environment")
	public async getAllSummoners(): Promise<ISummoner[]> {
		if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
			throw new Conflict("Not a development environment", 409);
		}

		const summonersInDB: ISummoner[] | null = await this.summonerService.findAllSummoners();

		if (summonersInDB === null) throw new NotFound("summoners not found", 404);

		return summonersInDB;
	}

	@Get("{summonerName}")
	@SuccessResponse("200")
	@Response<HttpError>("404", "Send if the Summoner could not be found")
	public async getSummonerByName(@Path() summonerName: string): Promise<ISummoner> {
		const summonerInDB: ISummoner | null = await this.summonerService.findSummonerByName(
			summonerName,
		);

		if (summonerInDB === null) {
			throw new NotFound(`could not find summoner ${summonerName}`, 404);
		}

		return summonerInDB;
	}

	@Post("{summonerName}")
	@SuccessResponse("200")
	@Response<HttpError>("409", "Summoner already exsits")
	public async postSummonerByName(@Path() summonerName: string): Promise<ISummoner> {
		let summonerInDB = await this.summonerService.findSummonerByName(summonerName);
		let summonerReponse: AxiosResponse<ISummoner, any>;
		let summonerCreated: ISummoner | null;

		if (summonerInDB != null) throw new Conflict("Summoner already exsits", 409);

		try {
			summonerReponse = await this.RGHttpClient.getSummonerByName(summonerName);

			await this.summonerRepo.createSummoner(summonerReponse.data);

			summonerCreated = await this.summonerRepo.findSummonerByName(summonerReponse.data.name);

			// ToDo
			// Error for 5xx
			if (summonerCreated === null) throw new InternalServer("Internal server error", 500);
		} catch (error) {
			throw error;
		}

		return summonerCreated;
	}
}
