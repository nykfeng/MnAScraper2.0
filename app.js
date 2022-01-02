const express = require("express");
const axios = require("axios");
const url = require("url");
const path = require("path"); // needed to set __dirname
const app = express();

// local modules
const prnewswire = require("./modules/prnewswire.js");
const businesswire = require("./modules/businesswire.js");
const globenewswire = require("./modules/globenewswire.js");
const seekingalpha = require("./modules/seekingalpha.js");

const utilities = require("./modules/utilities.js");
const helper = require("./modules/helper.js");

const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public")); // This will be for ejs to use public files like css, images

app.get("/", (req, res) => {
  utilities.dataResults = []; // reset
  res.render("index", { data: utilities.dataResults });
});

app.get("/result", async (req, res) => {
  console.log("Got your request for MnA result");
  console.log(req.query);
  const { chosenDate } = req.query;
  utilities.chosenDate = helper.getDate(
    chosenDate.length != 0
      ? new Date(chosenDate.replace(/-/g, ","))
      : new Date()
  );
  utilities.dataResults = [];
  console.log(utilities.chosenDate);
  //   await prnewswire.scrape();
  //   await businesswire.scrape();
  //   await globenewswire.scrape();
  await seekingalpha.scrape();
  //   console.log(utilities.dataResults);

  res.render("index", { data: utilities.dataResults });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
