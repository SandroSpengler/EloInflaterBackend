import axios, { AxiosError } from "axios";

// import { Request, Response, Router } from "express";

import { SummonerRepository } from "../../../Repository/SummonerRepository";

import { RiotGamesHttp } from "../../../Services/HttpService";
import { SummonerService } from "../../../Services/SummonerService";

import { formatSummonerForSending } from "../../../Services/FormatDocumentService";

import { Controller, Get, Path, Query, Route, SuccessResponse, Response } from "tsoa";
import { ISummoner } from "../../../Models/Interfaces/Summoner";

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
	private summonerService: SummonerService;
	private summonerRepo: SummonerRepository;

	private RGHttpClient;

	constructor() {
		super();

		this.RGHttpClient = new RiotGamesHttp();

		this.summonerRepo = new SummonerRepository();

		this.summonerService = new SummonerService(this.summonerRepo, this.RGHttpClient);
	}

	@Get("{summonerName}")
	@SuccessResponse("200")
	public async getSummonerByName(@Path() summonerName: string): Promise<ISummoner> {
		const summonerInDB: ISummoner | null = await this.summonerRepo.findSummonerByName(summonerName);

		if (summonerInDB === null) throw new Error("Smmoner is NULL");

		return summonerInDB;
	}
}
