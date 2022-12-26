import axios, { AxiosResponse, isAxiosError } from "axios";
import { MatchData } from "../Models/Interfaces/MatchData";
import Summoner from "../Models/Interfaces/Summoner";
import { MatchRepository } from "../Repository/MatchRepository";
import { SummonerRepository } from "../Repository/SummonerRepository";
import { RiotGamesHttp } from "./HttpService";
import { MatchService } from "./MatchService";
import { SummonerService } from "./SummonerService";
import * as winston from "winston";

export class DataMiningService {
	private summonerRepo: SummonerRepository;
	// private summonerService: SummonerService;

	private matchRepo: MatchRepository;
	private matchService: MatchService;

	private RGHttp: RiotGamesHttp;

	constructor(
		summonerRepo: SummonerRepository,
		// summonerService: SummonerService,
		RGHttp: RiotGamesHttp,
		matchRepo: MatchRepository,
		matchService: MatchService,
	) {
		this.RGHttp = RGHttp;
		this.summonerRepo = summonerRepo;
		// this.summonerService = summonerService;

		this.matchRepo = matchRepo;
		this.matchService = matchService;
	}

	/**
	 * Requests new Matches for Summoner and adds them
	 * @async
	 *
	 * @param SummonerPUUID that new matches should be added for
	 *
	 * @void
	 */
	addNewMatchesToSummoner = async (summonerPUUID: string): Promise<void> => {
		let matchRetryCount: number = 3;
		const summoner = await this.summonerRepo.findSummonerByPUUID(summonerPUUID);

		if (summoner === null) throw new Error("No Summoner was provided");

		let newMatchIdsForSummoner = await this.queryOustandingMatchesBySummonerPUUID(summoner);

		if (newMatchIdsForSummoner.length === 0) {
			summoner.lastMatchUpdate = new Date().getTime();
			summoner.outstandingMatches = 0;

			await this.summonerRepo.updateSummonerByPUUID(summoner);

			return;
		}

		try {
			for (let i = 0; i < matchRetryCount; i++) {
				if (newMatchIdsForSummoner.length === 0) {
					const summonerInDB = await this.summonerRepo.findSummonerByPUUID(summonerPUUID);

					summonerInDB!.outstandingMatches = 0;

					await this.summonerRepo.updateSummonerByPUUID(summonerInDB!);

					break;
				}

				if (i > 0) {
					winston.log("info", `Retry ${i}`);
				}

				newMatchIdsForSummoner = await this.requestAndAddNewMatchInformation(
					newMatchIdsForSummoner,
				);

				const summonerInDB = await this.summonerRepo.findSummonerByPUUID(summonerPUUID);
				summonerInDB!.outstandingMatches = newMatchIdsForSummoner.length;

				await this.summonerRepo.updateSummonerByPUUID(summonerInDB!);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.status !== 429) {
					return;
				}

				const summonerInDB = await this.summonerRepo.findSummonerByPUUID(summonerPUUID);

				summonerInDB!.outstandingMatches = 100;

				await this.summonerRepo.updateSummonerByPUUID(summonerInDB!);
			}

			throw error;
		} finally {
			await this.addUnassignedMatchesToSummoner(summonerPUUID);
		}
	};

	public queryOustandingMatchesBySummonerPUUID = async (summoner: Summoner): Promise<string[]> => {
		try {
			const recentMatches = (await this.RGHttp.getMatchesIdsBySummonerpuuid(summoner?.puuid)).data;

			await this.addUnassignedMatchesToSummoner(summoner?.puuid);

			if (summoner == null) {
				throw new Error(`Summoner could not be found`);
			}

			let newMatchIdsForSummoner = recentMatches.filter((matchId) => {
				let checkUninflated = summoner.uninflatedMatchList.find(
					(summonerMatchId) => summonerMatchId === matchId,
				);

				let checkinflated = summoner.inflatedMatchList.find(
					(summonerMatchId) => summonerMatchId === matchId,
				);

				// assinged matches can be returned here
				if (checkUninflated || checkinflated) return;

				return matchId;
			});

			return newMatchIdsForSummoner;
		} catch (error) {
			throw error;
		}
	};

	/**
	 * Finds all Matches in DB for a summoner and adds them to the Summoner.Matchlists
	 *
	 * @param summoner The Summoner that should be checked for
	 *
	 * @void
	 */
	addUnassignedMatchesToSummoner = async (summonerPUUID: string) => {
		if (summonerPUUID === undefined)
			throw new Error(`Summoner ${summonerPUUID} does not have a PUUID`);

		const summoner = await this.summonerRepo.findSummonerByPUUID(summonerPUUID);

		try {
			const matchesBySummonerPUUID = await this.matchRepo.findAllMatchesBySummonerPUUID(
				summoner!.puuid,
			);

			if (matchesBySummonerPUUID?.length === 0) return;

			const unassingedMatches = matchesBySummonerPUUID.filter((match) => {
				let checkUninflated = summoner!.uninflatedMatchList.find(
					(summonerMatchId) => summonerMatchId === match._id,
				);

				let checkinflated = summoner!.inflatedMatchList.find(
					(summonerMatchId) => summonerMatchId === match._id,
				);

				// assinged matches can be returned here
				if (checkUninflated || checkinflated) return;

				return match;
			});

			if (unassingedMatches.length === 0) {
				return;
			}

			for (let match of unassingedMatches) {
				const matchEvaluation = this.matchService.checkSummonerInMatchForEloInflation(
					match,
					summoner!.puuid,
				);

				if (matchEvaluation.inflated) {
					summoner!.inflatedMatchList.push(match._id);

					summoner!.exhaustCount += matchEvaluation.exhaustCount;
					summoner!.exhaustCastCount += matchEvaluation.exhaustCastCount;
					summoner!.tabisCount += matchEvaluation.tabisCount;
					summoner!.zhonaysCount += matchEvaluation.zhonaysCount;
				} else {
					summoner!.uninflatedMatchList.push(match._id);
				}
			}
		} catch (error) {
			throw error;
		} finally {
			let currentTime = new Date().getTime();

			summoner!.lastMatchUpdate = currentTime;

			await this.summonerRepo.updateSummonerByPUUID(summoner!);
		}
	};

	/**
	 * Requests all matches for a given matchId List and adds them to the DB
	 * @async
	 * @void
	 *
	 * @param matchIds List of all matches that need should be written into the DB
	 *
	 * @throws AxiosError 429 or 403 if they occured
	 */
	private requestAndAddNewMatchInformation = async (matchIds: string[]): Promise<string[]> => {
		const matchRequests: Promise<AxiosResponse<MatchData, any>>[] = matchIds.map((matchId) => {
			return this.RGHttp.getMatchByMatchId(matchId);
		});

		const settledMatches = await Promise.allSettled(matchRequests);

		const matchDataFulfilled = settledMatches
			.filter((match) => {
				return match.status === "fulfilled";
			})
			.map((promise) => {
				const p = promise as PromiseFulfilledResult<AxiosResponse<MatchData, any>>;

				return p.value.data;
			});

		if (matchDataFulfilled.length === 0) {
			return [];
		}

		const matchWritePromise = matchDataFulfilled.map((matchDataFulfilled) => {
			return this.matchRepo.createMatch(matchDataFulfilled);
		});

		try {
			await Promise.all(matchWritePromise);

			winston.log(
				"info",
				`Added ${matchDataFulfilled.length} Match(s). Fulfilled/AllMatches ${matchDataFulfilled.length}/${matchIds.length}`,
			);
		} catch (error) {
			winston.error("info", `Could not write Matches into DB ${error}`);
		}

		const rejectedMatchIds = matchIds.filter((matchId) => {
			return !matchDataFulfilled.find((matchData) => {
				return matchData.metadata.matchId === matchId;
			});
		});

		return rejectedMatchIds;
	};
}
