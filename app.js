// const express = require("express");
// const axios = require("axios");
// const url = require("url");
// const path = require("path"); // needed to set __dirname

import express from "express";

const app = express();

// local modules
// const prnewswire = require("./modules/prnewswire.js");
// const businesswire = require("./modules/businesswire.js");
// const globenewswire = require("./modules/globenewswire.js");
// const seekingalpha = require("./modules/seekingalpha.js");

// const utilities = require("./modules/utilities.js");
// const helper = require("./modules/helper.js");

import prnewswire from "./modules/prnewswire.js";
import businesswire from "./modules/businesswire.js";
import globenewswire from "./modules/globenewswire.js";
import axiosProRata from "./modules/axiosProRata.js";
import seekingAlpha from "./modules/seekingAlpha.js";

import utilities from "./modules/utilities.js";
import helper from "./modules/helper.js";

const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// app.set("views", path.join(__dirname, "views"));
app.set("views", "./views");
// app.use(express.static(__dirname + "/public")); // This will be for ejs to use public files like css, images

app.use(express.static("./public"));

app.get("/", (req, res) => {
  utilities.dataResults = []; // reset, so refresh to main page won't get the old results rendered
  res.render("index", { data: utilities.dataResults, hasResult: false });
});

app.get("/result", async (req, res) => {
  console.log("Got your request for M&A results");
  console.log(req.query);
  const { chosenDate } = req.query;
  utilities.chosenDate = helper.getDate(
    chosenDate.length != 0
      ? new Date(chosenDate.replace(/-/g, ","))
      : new Date()
  );

  utilities.dataResults = [];
  console.log(utilities.chosenDate);

  if (helper.dayRangeValidation(utilities.chosenDate)) {
    // await globenewswire.getData();
    await globenewswire.getData2();

    await businesswire.getData();
    // await businesswire.getData2();

    await prnewswire.getData();

    await seekingAlpha.getData();

    // if the selected date is today, then run for axios
    if (utilities.chosenDate === helper.getDate(new Date())) {
      await axiosProRata.getData();
    }

    // console.table(utilities.dataResults);
    console.log("Finished reading all pages~!");
    res.render("index", {
      data: utilities.dataResults,
      hasResult: utilities.dataResults.length === 0 ? false : true,
    });
  } else {
    res.render("index", { data: utilities.dataResults, hasResult: false });
  }
});

app.use((err, req, res, next) => {
  console.log("**************************");
  console.log("****ERROR****");
  console.log("**************************");
  console.log(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
