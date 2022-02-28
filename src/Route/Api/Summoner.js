const express = require("express");
const router = express.Router();

const { getSummonerByName } = require("../../Services/Http");

router.get("/:name", async (req, res) => {
  if (req.params.name) {
    try {
      const summoner = await getSummonerByName(req.params.name);

      res.status(200).json({
        success: true,
        result: summoner.data,
      });
    } catch (error) {
      console.log(" " + error.message);

      res.status(500);
      res.send("Error");
    }
  }
});

router.post("/", async (req, res) => {});

module.exports = router;
