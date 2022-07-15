import Summoner from "../Interfaces/Summoner";

type SummonerResponse = {
  success: boolean;
  result: Summoner | Summoner[] | null;
  error: string | null;
};

export { SummonerResponse };
