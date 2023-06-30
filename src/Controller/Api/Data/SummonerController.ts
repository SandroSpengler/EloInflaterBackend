import { AxiosResponse, HttpStatusCode } from "axios";

import { SummonerRepository } from "../../../Repository/SummonerRepository";

import { RiotGamesHttp } from "../../../Services/HttpService";
import { SummonerService } from "../../../Services/SummonerService";

import {
	Controller,
	Get,
	Path,
	Post,
	Put,
	Query,
	Response,
	Route,
	SuccessResponse,
	Tags,
} from "tsoa";

import HttpError from "../../../Models/Interfaces/Error/HttpError";
import { Conflict, NotFound } from "../../../Models/Interfaces/Error/Http4xx";
import { InternalServer } from "../../../Models/Interfaces/Error/Http5xx";

import { Summoner } from "../../../Models/Interfaces/Summoner";
import { rankSolo } from "../../../Models/Types/ApiTypes";
import { response } from "express";

@Tags("Summoner")
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

	/**
	 * DEVELOPMENT! - Returns all summoner from the DB.
	 */
	@Get("")
	@SuccessResponse("200")
	@Response<HttpError>("409", "Not a development environment")
	public async getAllSummoners(): Promise<Summoner[]> {
		if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
			throw new Conflict("Not a development environment", 409);
		}

		const summonersInDB: Summoner[] | null = await this.summonerService.findAllSummoners();

		if (summonersInDB === null) throw new NotFound("summoners not found", 404);

		return summonersInDB;
	}

	/**
	 * Returns a summoner for the DB.
	 *
	 * @param summonerName Name of the summoner.
	 */
	@Get("{summonerName}")
	@SuccessResponse("200")
	@Response<HttpError>("404", "Send if the Summoner could not be found")
	public async getSummonerByName(@Path() summonerName: string): Promise<Summoner> {
		const summonerInDB: Summoner | null = await this.summonerService.findSummonerByName(
			summonerName,
		);

		// What an exciting comment!
		if (summonerInDB === null) {
			throw new NotFound(`Could not find summoner ${summonerName}`, 404);
		}

		return summonerInDB;
	}

	/**
	 * Get all Sumoner by a specified Solo Queue Rank.
	 *
	 * @param rankSolo The Solo Queue Rank.
	 * @param page Results are paginated.
	 * @param size The amount of summoners on each page.
	 *
	 */
	@Get("/rank/{rankSolo}")
	@SuccessResponse("200")
	@Response<HttpError>("404", "Send if the Summoners could not be found")
	public async getSummonerByRankSoloAndQueueType(
		@Path() rankSolo: rankSolo,
		@Query() page?: number,
		@Query() size?: number,
	): Promise<Summoner[]> {
		const summonersInDB: Summoner[] | null = await this.summonerRepo.findAllSummonersByRank(
			rankSolo,
		);

		if (summonersInDB === null) {
			throw new NotFound(`Could not find summoners by rank ${rankSolo}`, 404);
		}

		return summonersInDB;
	}

	/**
	 * Added a new summoner from the Riot Games Api to the DB.
	 *
	 * @param summonerName Name of the summoner.
	 */
	@Post("{summonerName}")
	@SuccessResponse("200")
	@Response<HttpError>("409", "Summoner already exsits")
	public async postSummonerByName(@Path() summonerName: string): Promise<Summoner> {
		let summonerInDB = await this.summonerService.findSummonerByName(summonerName);
		let summonerReponse: AxiosResponse<Summoner, any>;
		let summonerCreated: Summoner | null;

		if (summonerInDB != null) throw new Conflict("Summoner already exsits", 409);

		try {
			summonerReponse = await this.RGHttpClient.getSummonerByName(summonerName);

			await this.summonerRepo.createSummoner(summonerReponse.data);

			summonerCreated = await this.summonerRepo.findSummonerByName(summonerReponse.data.name);

			if (summonerCreated === null) throw new InternalServer("Internal server error", 500);
		} catch (error) {
			throw error;
		}

		return summonerCreated;
	}

	/**
	 * Checks if a summoner is out of date and updates the summoner.
	 *
	 * @param summonerId Id of the summoner.
	 */
	@Put("{summonerId}")
	@SuccessResponse("204", "Summoner has been updated")
	@Response<HttpError>("404", "Send if the Summoners could not be found")
	@Response<HttpError>("409", "Summoner already was updated recently")
	@Response<HttpError>("429", "Too many requests please try again later")
	public async putSummonerBySummonerId(@Path() summonerId: string): Promise<void> {
		let summonerInDB = await this.summonerRepo.findSummonerByID(summonerId);

		if (summonerInDB === null) {
			throw new NotFound(`Could not find summoner with id ${summonerId}`, 404);
		}

		if (!this.summonerService.checkIfSummonerCanBeUpdated(summonerInDB)) {
			throw new Conflict("Summoner already updated recently", 409);
		}

		try {
			const currentSummonerResponse = await this.RGHttpClient.getSummonerBySummonerId(
				summonerInDB.id,
			);

			const summonerRank = await this.RGHttpClient.getSummonerRankLeagueInfo(
				currentSummonerResponse.data.id,
			);

			await this.summonerService.updateSummonerWithRankInformation(
				currentSummonerResponse.data,
				summonerRank.data,
			);
		} catch (error) {
			throw error;
		}

		return;
	}
}
