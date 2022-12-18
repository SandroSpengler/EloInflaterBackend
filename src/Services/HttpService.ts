/* eslint-disable @typescript-eslint/no-unused-vars */
// const axios = require("axios");

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { MatchData } from "../Models/Interfaces/MatchData";
import Summoner from "../Models/Interfaces/Summoner";
import SummonerByLeague from "../Models/Interfaces/SummonerByLeague";
import { SbLQueue, SbLTier } from "../Models/Types/SummonerByLeagueTypes";

export class RiotGamesHttp {
	// only change by Region
	private protocol = "https://";
	private regionUrl = "euw1.api.riotgames.com";
	private matchRegionUrl = "europe.api.riotgames.com";
	private genericUrl = "/lol/";

	// changes for each endpoint
	private enpointUrl = "";

	public getSummonerByName = async (name: string): Promise<AxiosResponse<Summoner>> => {
		try {
			const request = axios.get<Summoner>(
				`${this.buildBaseUrl(this.regionUrl, "summoner/v4/summoners/by-name/")}${encodeURI(name)}`,
				this.buildConfig(),
			);

			const response = await request;

			return await response;
		} catch (error) {
			// console.log(error);
			throw error;
		}
	};

	public getSummonerBySummonerId = async (id: string): Promise<AxiosResponse<Summoner>> => {
		try {
			const request = axios.get<Summoner>(
				`${this.buildBaseUrl(this.regionUrl, "summoner/v4/summoners/")}${id}`,
				this.buildConfig(),
			);

			const response = await request;

			return await response;
		} catch (error) {
			// console.log(error);
			throw error;
		}
	};

	/**
	 * HTTP-Request for SummonerByLeague
	 *
	 * @param tier Name of the Division Tier
	 * @param queue Name of the Queue Type
	 *
	 * @returns HTTP-Response cotaining the SummonersByLeauge
	 */
	public getSummonersByLeague = async (
		tier: SbLTier,
		queue: SbLQueue,
	): Promise<AxiosResponse<SummonerByLeague>> => {
		let tierRequestParam = "";

		if (tier === "CHALLENGER") tierRequestParam = "challengerleagues";
		if (tier === "GRANDMASTER") tierRequestParam = "grandmasterleagues";
		if (tier === "MASTER") tierRequestParam = "masterleagues";

		try {
			const request = axios.get<SummonerByLeague>(
				`${this.buildBaseUrl(this.regionUrl, `league/v4/${tierRequestParam}/by-queue/`)}${queue}`,
				this.buildConfig(),
			);

			const response = await request;

			return await response;
		} catch (error) {
			// console.log(error);
			throw error;
		}
	};

	public getMatchesIdsBySummonerpuuid = async (puuid: string): Promise<AxiosResponse<string[]>> => {
		try {
			await this.sleep(200);

			const request = axios.get<string[]>(
				`${this.buildBaseUrl(
					this.matchRegionUrl,
					"match/v5/matches/by-puuid/",
				)}${puuid}/ids?start=0&count=100`,
				this.buildConfig(),
			);

			const response = await request;

			return await response;
		} catch (error) {
			// console.log(error);
			throw error;
		}
	};

	public getMatchByMatchId = async (matchId: String): Promise<AxiosResponse<MatchData>> => {
		try {
			const request = await axios.get<MatchData>(
				`${this.buildBaseUrl(this.matchRegionUrl, "match/v5/matches/")}${matchId}`,
				this.buildConfig(),
			);

			const response = await request;

			return await response;
		} catch (error) {
			// console.log(error);
			throw error;
		}
	};

	private buildBaseUrl = (regionUrl, endpointUrl) => {
		let completeUrl = `${this.protocol}${regionUrl}${this.genericUrl}${endpointUrl}`;

		return completeUrl;
	};

	/**
	 * Builds the Axios-Config
	 *
	 * @returns Axios Config
	 */
	private buildConfig = (): AxiosRequestConfig => {
		const config: AxiosRequestConfig = {
			headers: {
				"X-Riot-Token": process.env.API_KEY,
				"Accept-Encoding": "application/json",
			},
		};

		return config;
	};

	private sleep = (ms = 200): Promise<void> => {
		// console.log("Kindly remember to remove `sleep`");
		return new Promise((resolve) => setTimeout(resolve, ms));
	};
}
// module.exports = { getSummonerByName, getSummonersByLeague };
