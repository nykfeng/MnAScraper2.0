// const fetch = require("./fetch.js");
// const cheerio = require("cheerio");
// const helper = require("./helper.js");
// const utilities = require("./utilities.js");

import fetch from "./fetch.js";
import cheerio from "cheerio";
import helper from "./helper.js";
import utilities from "./utilities.js";

const scrape = async function () {
  let prnewswireUrl = utilities.prnewswireUrl;

  // This is used to find if the algo found the desired date and then finished going thru the same date
  const foundChosenDate = {
    foundDate: false, // Found the chosen date
    finishedDate: false, // Read all the chosen date data until it reached an earlier date (meaning end of reading)
  };

  // While we haven't finished reading the chosen date's data, we continue
  while (!foundChosenDate.finishedDate) {
    console.log(`Now reading URL -- ${prnewswireUrl}`);
    const html = await fetch.onePage(prnewswireUrl);
    const $ = cheerio.load(html);

    // Targeting the HTML element containing each article
    $("div[lang=en-US]", html).each(function () {
      let transactionTitle = helper.fixPRNewswireTitleString(
        $(this).find(".card h3").html()
      );
      let transactionUrl = `https://www.prnewswire.com${$(this)
        .find(".newsreleaseconsolidatelink")
        .attr("href")}`;
      let transactionDate = $(this).find(".card h3 > small").text();
      transactionDate = helper.getDate(
        transactionDate.length < 10
          ? new Date()
          : new Date(helper.fixDateString(transactionDate))
      );

      let transactionImage = $(this).find(".card img").attr("src") || "";

      // console.log(`transactionTitle: ${transactionTitle}`);
      // console.log(`transactionUrl: ${transactionUrl}`);
      // console.log(`transactionDate: ${transactionDate}`);
      // console.log(`transactionImage: ${transactionImage}`);

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

        utilities.dataResults.push({
          transactionTitle,
          transactionUrl,
          transactionDate,
          transactionImage,
        });
      } else if (
        new Date(transactionDate) - new Date(utilities.chosenDate) < 0 &&
        foundChosenDate.foundDate === true
      ) {
        foundChosenDate.finishedDate = true; // Used to break out of the while loop when condition breaks
      }
    });
    prnewswireUrl = `https://www.prnewswire.com/news-releases/financial-services-latest-news/acquisitions-mergers-and-takeovers-list/${
      $(".pagination a[aria-label=Next]").attr("href") || ""
    }`;
  }
};

// module.exports = { scrape };

export default {
  scrape,
};
