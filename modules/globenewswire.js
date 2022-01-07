// const fetch = require("./fetch.js");
// const cheerio = require("cheerio");
// const helper = require("./helper.js");
// const utilities = require("./utilities.js");
// const languageDetect = require("languagedetect");

import fetch from "./fetch.js";
import cheerio from "cheerio";
import helper from "./helper.js";
import utilities from "./utilities.js";
import languageDetect from "languagedetect";

const exclusionList = [
  "Rathbone Brothers Plc",
  "Dimensional Fund Advisors Ltd",
  "Investec Wealth & Investment Limited",
  "Proactive",
  "Fortune Business Insights",
  "Market Research Future",
];

const scrape = async function () {
  let globenewswireUrl = utilities.globenewswireUrl;

  // This is used to find if the algo found the desired date and then finished going thru the same date
  const foundChosenDate = {
    foundDate: false, // Found the chosen date
    finishedDate: false, // Read all the chosen date data until it reached an earlier date (meaning end of reading)
  };

  // While we haven't finished reading the chosen date's data, we continue
  while (!foundChosenDate.finishedDate) {
    console.log(`Now reading URL -- ${globenewswireUrl}`);

    const html = await fetch.onePage(globenewswireUrl);
    const $ = cheerio.load(html);

    const lngDetector = new languageDetect();

    // Targeting the HTML element containing each article
    $(".pagnition-row", html).each(function () {
      let transactionTitle = $(this).find("a[data-autid=article-url]").text();
      let transactionUrl = `https://www.globenewswire.com/${$(this)
        .find("a[data-autid=article-url]")
        .attr("href")}`;
      let transactionDate = helper.getDate(
        new Date(helper.fixDateString($(this).find(".dataAndtimeH").text()))
      );
      let transactionImage = $(this).find("img").attr("src") || "";
      let source = $(this).find(".sourceLinkH a").text().trim();

      let titleLanguage =
        lngDetector.detect(transactionTitle).length === 0
          ? "Foreign"
          : lngDetector.detect(transactionTitle)[0][0];

      // -----------------------------------------------------------------------------
      // If the scraper past over the chosen date (from latest to oldest), the while loop should end
      // The while loop ends when foundChosenDate.finishedDate is true
      // This condition (foundChosenDate.foundDate === false) is ued because sometimes
      // A chosen date does not have transactions, like weekends

      // The first condition of the following if statement means if we reached a day prior the chosen date
      // And the chosen day was never found, that means it s likely a weekend day
      // So we set the finished date to true, meaning we can wrap this up
      if (
        new Date(transactionDate) - new Date(utilities.chosenDate) < 0 &&
        foundChosenDate.foundDate === false
      ) {
        foundChosenDate.finishedDate = true;
      }

      if (transactionDate === utilities.chosenDate) {
        foundChosenDate.foundDate = true;
        // Conditions to be considerd a valid transactions:
        // 1) in English 2) Not from the exclusion list
        if (
          titleLanguage === "english" &&
          exclusionList.find((el) => el === source) === undefined
        ) {
          utilities.dataResults.push({
            transactionTitle,
            transactionUrl,
            transactionDate,
            transactionImage,
          });
        }
      }
      // If transaction date is older than chosen date, so the program has gone through all necessary transactions
      // If foundDate is true, it means it has found the chosen date transactions
      else if (
        new Date(transactionDate) - new Date(utilities.chosenDate) < 0 &&
        foundChosenDate.foundDate === true
      ) {
        foundChosenDate.finishedDate = true; // Used to break out of the while loop when condition breaks
      }
    });

    globenewswireUrl = `https://www.globenewswire.com${
      $(".pagnition-container .pagnition-next a").attr("href") || ""
    }`;
  }
};

export default {
  scrape,
};
