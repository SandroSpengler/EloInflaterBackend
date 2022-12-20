import { Controller, Path, Put, Route, SuccessResponse, Tags, Response, Query, Get } from "tsoa";
import { SummonerRepository } from "../../../Repository/SummonerRepository";
import { SummonerService } from "../../../Services/SummonerService";
import { RiotGamesHttp } from "../../../Services/HttpService";
import { MatchRepository } from "../../../Repository/MatchRepository";
import { MatchService } from "../../../Services/MatchService";
import { NotFound, Conflict } from "../../../Models/Interfaces/Error/Http4xx";
import HttpError from "../../../Models/Interfaces/Error/HttpError";
import { DataMiningService } from "../../../Services/DataMiningService";
import { MatchData } from "../../../Models/Interfaces/MatchData";

@Tags("Match")
@Route("api/data/match")
export class MatchController extends Controller {
	public summonerRepo: SummonerRepository;
	public summonerService: SummonerService;

	private matchRepo: MatchRepository;
	private matchService: MatchService;

	public RGHttpClient: RiotGamesHttp;
	public dataMiningService: DataMiningService;

	constructor() {
		super();

		this.RGHttpClient = new RiotGamesHttp();

		this.summonerRepo = new SummonerRepository();
		this.summonerService = new SummonerService(this.summonerRepo, this.RGHttpClient);

		this.matchRepo = new MatchRepository();
		this.matchService = new MatchService(this.matchRepo, this.RGHttpClient);

		this.dataMiningService = new DataMiningService(
			this.summonerRepo,
			this.RGHttpClient,
			this.matchRepo,
			this.matchService,
		);
	}

	/**
	 * Get all Matches for a specified summonerPUUID.
	 *
	 * @param summoerId The Solo Queue Rank.
	 * @param page Results are paginated.
	 * @param size The amount of summoners on each page MAX 100.
	 *
	 */
	@Get("/{sumonerPUUID}")
	@SuccessResponse("200")
	@Response<HttpError>("404", "Send if the Summoners could not be found")
	public async getMatchesBySummonerPUUID(
		@Path() sumonerPUUID: string,
		@Query() page?: number,
		@Query() size?: number,
	): Promise<MatchData[]> {
		const matchesForSummoner = await this.matchRepo.findAllMatchesBySummonerPUUID(sumonerPUUID);

		if (matchesForSummoner === null) {
			throw new NotFound(`Could not find matches for summonerPUUID ${sumonerPUUID}`, 404);
		}

		return matchesForSummoner;
	}

	/**
	 * Checks if a summoner has outstanding matches and adds them to the summoner.
	 *
	 * @param summonerId Id of the summoner.
	 */
	@Put("{summonerId}")
	@SuccessResponse("200", "Summoner has been updated")
	@Response<HttpError>("404", "Send if the Summoners could not be found")
	@Response<HttpError>("409", "Summoner matches already updated recently")
	@Response<HttpError>("429", "Too many requests please try again later")
	public async putMatchBySummonerId(@Path() summonerId: string): Promise<void> {
		const summonerInDB = await this.summonerRepo.findSummonerByID(summonerId);

		if (summonerInDB === null) {
			throw new NotFound(`Could not find summoner with id ${summonerId}`, 404);
		}

		if (!this.summonerService.checkIfSummonerMatchesCanBeUpdated(summonerInDB)) {
			throw new Conflict("Summoner already updated recently", 409);
		}

		try {
			await this.dataMiningService.addNewMatchesToSummoner(summonerInDB.puuid);

			await this.summonerRepo.findSummonerByID(summonerId);
		} catch (error) {
			throw error;
		}

		return;
	}
}
