import { MatchData } from "../Models/Interfaces/MatchData";
import Summoner from "../Models/Interfaces/Summoner";
import { getSummonerBySummonerId, getMatchesIdsBySummonerpuuid, getMatchByMatchId } from "../Services/Http";
import {
  checkSummonerMatchesForEloInflation,
  createMatchWithSummonerInformation,
  findAllMatchesBySummonerPUUID,
  findMatchById,
} from "./MatchRepository";
import {
  findAllSummoners,
  findAllSummonersByRank,
  updateSummonerByPUUID,
  updateSummonerBySummonerID,
} from "./SummonerRepository";

export const checkForNewSummonerMatches = async (updateType: string) => {
  console.log("3. Checking Matches in Queue " + updateType);
  let queuedSummoners: Summoner[] | null = [];

  try {
    queuedSummoners = await findAllSummonersByRank(updateType);

    if (queuedSummoners === null || queuedSummoners.length === 0) return;

    for (let [index, summoner] of queuedSummoners.entries()) {
      console.log(`3. Getting Matches for ${summoner.name}: ${updateType} index: ${index}`);

      try {
        if (summoner.puuid === "" || summoner.puuid === undefined) {
          summoner.puuid = (await getSummonerBySummonerId(summoner._id)).data.puuid;
          await updateSummonerBySummonerID(summoner);
        }
      } catch (error) {
        break;
      }

      try {
        let unixTimeStamp = new Date().getTime() - 3600 * 96 * 1000;
        if (summoner.lastMatchUpdate! !== undefined && unixTimeStamp < summoner.lastMatchUpdate!) {
          console.log(`3. Summoner ${summoner.name} already checked recently`);

          continue;
        }
      } catch (error) {}

      // Update Summoner Matches
      try {
        // Check what matches arent already in summoner

        let newMatchIds: string[] = (await getMatchesIdsBySummonerpuuid(summoner.puuid)).data;
        summoner.lastMatchUpdate = new Date().getTime();
        await updateSummonerBySummonerID(summoner);

        if (newMatchIds === undefined || newMatchIds === null || newMatchIds.length === 0) continue;

        let matchesToUpdate: string[] = [];

        for (const newMatchId of newMatchIds) {
          let exsistingMatch = await findMatchById(newMatchId);

          if (exsistingMatch != null && exsistingMatch[0] === undefined) {
            matchesToUpdate.push(newMatchId);
          }
        }

        if (matchesToUpdate === undefined || matchesToUpdate.length === 0) continue;

        for (const [index, matchid] of matchesToUpdate.entries()) {
          let summonerMatchDetails = (await getMatchByMatchId(matchid)).data;

          await createMatchWithSummonerInformation(summonerMatchDetails, summoner.puuid, summoner.id);

          summoner.matchList?.push(matchid);

          await updateSummonerBySummonerID(summoner);

          console.log(`3. Added Match for ${summoner.name} at index: ${index}`);
        }
      } catch (error: any) {
        console.log(error.message);
        break;
      }
    }

    // GET Summoners that need updating from db
    // Search Summoners for summoners that need updating
    // await updatSummonerMatches()
  } catch (error) {
    throw error;
  } finally {
    console.log("3. Finished searching for matches ");
  }
};

export const updatSummonerMatches = async (summoner: Summoner) => {
  console.log("updating summoner");

  try {
    // Check what matches arent already in summoner

    let newMatchIds: string[] = (await getMatchesIdsBySummonerpuuid(summoner.puuid)).data;
    summoner.lastMatchUpdate = new Date().getTime();
    await updateSummonerBySummonerID(summoner);

    if (newMatchIds === undefined || newMatchIds === null || newMatchIds.length === 0) return;

    let matchesToUpdate: string[] = [];

    for (const newMatchId of newMatchIds) {
      let exsistingMatch = await findMatchById(newMatchId);

      if (exsistingMatch != null && exsistingMatch[0] === undefined) {
        matchesToUpdate.push(newMatchId);
      }
    }

    if (matchesToUpdate === undefined || matchesToUpdate.length === 0) return;

    for (const [index, matchid] of matchesToUpdate.entries()) {
      let summonerMatchDetails = (await getMatchByMatchId(matchid)).data;

      await createMatchWithSummonerInformation(summonerMatchDetails, summoner.puuid, summoner.id);

      summoner.matchList?.push(matchid);

      await updateSummonerBySummonerID(summoner);

      console.log(`3. Added Match for ${summoner.name} at index: ${index}`);
    }
  } catch (error: any) {
    console.log(error.message);
    throw error;
  } finally {
    await checkSummonerMatchesForEloInflation(summoner);
  }
};

export const checkSummonerMatchIdLists = async () => {
  try {
    let allSummoners = await findAllSummoners();

    let summonerToCheck = allSummoners?.filter(
      (summoner) => summoner.matchList === undefined || summoner.matchList.length === 0
    );

    for (let [index, summoner] of summonerToCheck!.entries()) {
      console.log(`Updating Summoner ${summoner.name} at index ${index}`);

      let matchesInDB = await findAllMatchesBySummonerPUUID(summoner.puuid);

      for (let match of matchesInDB!) {
        summoner.matchList?.push(match._id.toString());
      }

      await updateSummonerByPUUID(summoner);

      console.log("done");
    }

    console.log(summonerToCheck);
  } catch (error) {
    throw error;
  }
};
