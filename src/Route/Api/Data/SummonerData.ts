const express = require("express");
const router = express.Router();

import axios, { AxiosError } from "axios";
import {
  createSummoner,
  findSummonerByID,
  findSummonerByName,
  findSummonerByPUUID,
} from "../../../Repository/SummonerRepository";
import { formatSummonerForSending } from "../../../Services/FormatDocument";
import { getSummonerByName } from "../../../Services/Http";

router.get("/:name", async (req, res) => {
  if (req.params.name) {
    try {
      let queryName = encodeURI(req.params.name);

      // Search by PUUID and by Name to get 1 less requeset
      // let summonerInDB = await findSummonerByName(Response.data.name);
      let summonerInDB = await findSummonerByName(req.params.name);

      // if getSummonerByName/PUUID returns an entry add the summoner
      if (summonerInDB != null) {
        return res.status(200).json({
          success: true,
          result: formatSummonerForSending(summonerInDB),
        });
      } else {
        let getsummonerBynameResponse = await getSummonerByName(queryName);

        if (getsummonerBynameResponse.status === 200) {
          await createSummoner(getsummonerBynameResponse.data);

          return res.status(280).json({
            success: true,
            result: formatSummonerForSending(getsummonerBynameResponse.data),
          });
        }
      }

      return res.status(404).json({
        success: true,
        result: "Summoner not Found",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        let axiosError: AxiosError = error;

        if (axiosError.response?.status === 404) {
          return res.status(404).json({ success: false, message: "Summoner not found" });
        }
      }

      res.status(500);
      res.send("Error");
    }
  }
});

router.post("/", async (req, res) => {});

module.exports = router;
