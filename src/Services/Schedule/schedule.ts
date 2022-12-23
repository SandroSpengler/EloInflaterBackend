import axios from "axios";
import * as winston from "winston";

import { MatchRepository } from "../../Repository/MatchRepository";
import { SummonerByLeagueRepository } from "../../Repository/SummonerByLeagueRepository";
import { SummonerRepository } from "../../Repository/SummonerRepository";

import { DataMiningService } from "../../Services/DataMiningService";
import { RiotGamesHttp } from "../../Services/HttpService";
import { MatchService } from "../../Services/MatchService";
import { SummonerByLeagueService } from "../../Services/SummonerByLeagueService";
import { SummonerService } from "../../Services/SummonerService";

class Scheduler {
	private RGHttp = new RiotGamesHttp();

	private summonerRepo = new SummonerRepository();
	private summonerService = new SummonerService(this.summonerRepo, this.RGHttp);

	private SbLRepo = new SummonerByLeagueRepository();
	private SbLService = new SummonerByLeagueService(this.SbLRepo, this.summonerRepo, this.RGHttp);

	private matchRepo = new MatchRepository();
	private matchService = new MatchService(this.matchRepo, this.RGHttp);

	private dataMiningService = new DataMiningService(
		this.summonerRepo,
		this.RGHttp,
		this.matchRepo,
		this.matchService,
	);

	constructor() {
		this.RGHttp = new RiotGamesHttp();

		this.summonerRepo = new SummonerRepository();
		this.SbLRepo = new SummonerByLeagueRepository();

		this.summonerService = new SummonerService(this.summonerRepo, this.RGHttp);
		this.SbLService = new SummonerByLeagueService(this.SbLRepo, this.summonerRepo, this.RGHttp);

		this.dataMiningService = new DataMiningService(
			this.summonerRepo,
			this.RGHttp,
			this.matchRepo,
			this.matchService,
		);
	}

	schedule = async (): Promise<void> => {
		try {
			await this.updateSbLCollections();
			await this.validateSummonerInSbLCollection();
			await this.addNewMatches();
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 429) {
					winston.log("warn", `Rate Limit:  ${error.message}`);
					console.error(error.message);
				} else {
					winston.log("error", error.message);
					console.log(error.message);
				}
			} else {
				winston.log("error", error.message);
				console.log(error.message);
			}
		} finally {
			const timeout = 2 * 15 * 1000;

			winston.log("info", `Cycle done - Restarting in: ${timeout}ms`);
			console.log("info", `Cycle done - Restarting in: ${timeout}ms`);

			await setTimeout(() => {
				this.schedule();
			}, timeout);
		}
	};

	public updateSbLCollections = async () => {
		const SbLChallenger = await this.SbLRepo.findSummonerByLeague("CHALLENGER", "RANKED_SOLO_5x5");

		const SbLGrandMaster = await this.SbLRepo.findSummonerByLeague(
			"GRANDMASTER",
			"RANKED_SOLO_5x5",
		);

		const SbLMaster = await this.SbLRepo.findSummonerByLeague("MASTER", "RANKED_SOLO_5x5");

		if (this.SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLChallenger)) {
			winston.log("info", `Updating SummonerByLeague ${SbLChallenger.tier} Collection`);

			const newSbLChallenger = (
				await this.RGHttp.getSummonersByLeague("CHALLENGER", "RANKED_SOLO_5x5")
			).data;

			await this.SbLRepo.updateSummonerByLeauge(newSbLChallenger);
			await this.summonerService.updateSumonersByLeague(newSbLChallenger);

			winston.log("info", `SummonerByLeague ${SbLChallenger.tier} - Done`);
			console.log("info", `SummonerByLeague ${SbLChallenger.tier} - Done`);
		}

		if (this.SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLGrandMaster)) {
			winston.log("info", `Updating SummonerByLeague ${SbLGrandMaster.tier} Collection`);

			const newSbLGrandMaster = (
				await this.RGHttp.getSummonersByLeague("GRANDMASTER", "RANKED_SOLO_5x5")
			).data;

			await this.SbLRepo.updateSummonerByLeauge(newSbLGrandMaster);
			await this.summonerService.updateSumonersByLeague(newSbLGrandMaster);

			winston.log("info", `SummonerByLeague ${SbLGrandMaster.tier} - Done`);
			console.log("info", `SummonerByLeague ${SbLGrandMaster.tier} - Done`);
		}

		if (this.SbLService.checkIfSummonersByLeagueCanBeUpdated(SbLMaster)) {
			winston.log("info", `Updating SummonerByLeague ${SbLMaster.tier} Collection`);

			const newSbLMaster = (await this.RGHttp.getSummonersByLeague("MASTER", "RANKED_SOLO_5x5"))
				.data;

			await this.SbLRepo.updateSummonerByLeauge(newSbLMaster);
			await this.summonerService.updateSumonersByLeague(newSbLMaster);

			winston.log("info", `SummonerByLeague ${SbLMaster.tier} - Done`);
			console.log("info", `SummonerByLeague ${SbLMaster.tier} - Done`);
		}

		winston.log("info", `updating SbLCollections finished`);
		console.log("info", `updating SbLCollections finished`);
	};

	/**
	 * Checks all Summoners ranked in CHALLENGER, GRANDMASTER and MASTER
	 * in order to validate that all Summoner information is saved in the DB
	 * @asnyc
	 *
	 * @returns void
	 */
	validateSummonerInSbLCollection = async (): Promise<void> => {
		const allSummoners = await this.summonerRepo.findAllRankedSummonersAboveMaster();

		try {
			for (let [index, summoner] of allSummoners.entries()) {
				if (summoner.puuid !== "" && summoner._id !== "" && summoner.accountId !== "") {
					continue;
				}

				winston.log(
					"info",
					`validating summonerId for Summoner ${summoner.name} at ${index + 1} of ${
						allSummoners.length
					}`,
				);

				await this.summonerService.validateSummonerById(summoner._id);
			}
		} catch (error) {
			throw error;
		} finally {
			winston.log("info", `validating SbLCollection finished`);
		}
	};

	/**
	 * Adds new Matches to Summoners :)
	 * @async
	 *
	 * @returns Promise<void>
	 */
	addNewMatches = async (): Promise<void> => {
		const allSummoners = await this.summonerRepo.findAllRankedSummonersAboveMaster();

		const updateAbleSummoners = allSummoners
			.filter((summoner) => {
				if (this.summonerService.checkIfSummonerMatchesCanBeUpdated(summoner)) {
					return summoner;
				}
			})
			.sort((summoner1, summoner2) => {
				return summoner1.lastMatchUpdate! - summoner2.lastMatchUpdate!;
			});

		try {
			for (let [index, summoner] of updateAbleSummoners.entries()) {
				winston.log(
					"info",
					`Updating Summoner matches for ${summoner.name} at ${index + 1} of ${
						updateAbleSummoners.length
					}`,
				);
				console.log(
					"info",
					`Updating Summoner matches for ${summoner.name} at ${index + 1} of ${
						updateAbleSummoners.length
					}`,
				);
				await this.dataMiningService.addNewMatchesToSummoner(summoner.puuid);
			}
		} catch (error) {
			throw error;
		}
	};
}

export { Scheduler };
