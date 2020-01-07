const express = require("express");
const router = express.Router();
const axios = require("axios");
const DARK_SKY_API_KEY = process.env.DARK_SKY_API_KEY;

router.post("/", async (req, res) => {
  const url = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${req.body.lat},${req.body.lng}?units=ca`;

  try {
    const dark_sky_res = await axios.get(url);
    return res.json(dark_sky_res.data.currently);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
