const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.send("wow");
  } catch (error) {
    console.log(" " + error.message);

    res.status(500);
    res.send("Error");
  }
});

router.post("/", async (req, res) => {});

module.exports = router;
