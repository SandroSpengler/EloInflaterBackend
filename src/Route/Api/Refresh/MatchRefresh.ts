import axios, { AxiosError } from "axios";
import { Request, Response } from "express";

const express = require("express");
const router = express.Router();

router.get("/:summonerId", (req: Request, res: Response) => {
  try {
    // find summoner in Database

    // update summoner matches

    return res.status(200).json({ success: true, message: "Summoner matches have been updated" });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      let axiosError: AxiosError = error;

      if (axiosError.response?.status === 429) {
        return res.status(429).json({ success: false, message: "Rate Limited" });
      }
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
