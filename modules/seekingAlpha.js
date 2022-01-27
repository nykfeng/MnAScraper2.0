import fetch from "./fetch.js";
import cheerio from "cheerio";
import helper from "./helper.js";
import utilities from "./utilities.js";
import puppeteer from "puppeteer";

const scrape = async function () {
  let seekingAlphaUrl = utilities.seekingAlphaUrl;

  // This is used to find if the algo found the desired date and then finished going thru the same date
  const foundChosenDate = {
    foundDate: false, // Found the chosen date
    finishedDate: false, // Read all the chosen date data until it reached an earlier date (meaning end of reading)
  };

  // While we haven't finished reading the chosen date's data, we continue
  while (!foundChosenDate.finishedDate) {
    console.log(`Now reading URL -- ${seekingAlphaUrl}`);
    

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(seekingAlphaUrl);

    // wait for javascript rendered data to load
    await page.waitForTimeout(7000);

    // Targeting the HTML element containing each article
    await page.waitForSelector(".twA");

    console.log("Gotten twA");
    const data = await page.evaluate(() => {
      const result = [];
      const items = document.querySelector(".vzA").querySelectorAll(".tcA");

      items.forEach((item) => {
        let transactionTitle = item.querySelector("a.weD").innerText;
        // let transactionUrl = item.querySelector("a.miD").href;
        let transactionDate = item.querySelector(".zkL").innerText;
        let transactionUrl = "";
        let transactionImage = "";

        result.push({
          transactionTitle,
          transactionDate,
          transactionUrl,
          transactionImage,
        });
      });

      const nextUrl = document.querySelector("a[rel=next]").href;

      return { result, nextUrl };
    });

    await browser.close();

    const articles = data.result;

    console.table(articles);
    console.log(
      "----------------------------------------------------------------------------------------"
    );
    articles.forEach((eachArticle) => {
      // console.log(each.transactionDate);
      const transactionDate = helper.getDate(
        new Date(helper.seekingalphaDateStrModify(eachArticle.transactionDate))
      );
      const transactionUrl = helper.createGoogleSearchLink(
        eachArticle.transactionTitle
      );
      // console.log(new Date(utilities.chosenDate));
      // console.log(transactionDate);

      if (
        new Date(transactionDate) - new Date(utilities.chosenDate) < 0 &&
        foundChosenDate.foundDate === false
      ) {
        foundChosenDate.finishedDate = true;
      }

      if (transactionDate === utilities.chosenDate) {
        foundChosenDate.foundDate = true;
        utilities.dataResults.push({
          transactionTitle: eachArticle.transactionTitle,
          transactionUrl,
          transactionDate,
          transactionImage: eachArticle.transactionImage,
        });
      } else if (
        new Date(transactionDate) - new Date(utilities.chosenDate) < 0 &&
        foundChosenDate.foundDate === true
      ) {
        foundChosenDate.finishedDate = true; // Used to break out of the while loop when condition breaks
      }
    });

    seekingAlphaUrl = data.nextUrl;
  }
};

// Targeting the HTML element containing each article
// $("article[data-test-id=post-list-item]", html).each(function () {
//   let transactionTitle = $(this).find("a.miD").text();
//   let transactionUrl = $(this).find("a.miD").attr("href");

//   let transactionDate = $(this)
//     .find("span[data-test-id=post-list-date]")
//     .text();

//   transactionDate = helper.getDateFromSeekingAlpha(transactionDate);

//   let transactionImage = $(this).find("img").attr("src") || "";

//   console.log(`transactionTitle: ${transactionTitle}`);
//   console.log(`transactionUrl: ${transactionUrl}`);
//   console.log(`transactionDate: ${transactionDate}`);
//   console.log(`transactionImage: ${transactionImage}`);

//   // -----------------------------------------------------------------------------
//   // If the scraper past over the chosen date (from latest to oldest), the while loop should end
//   // The while loop ends when foundChosenDate.finishedDate is true
//   // This condition (foundChosenDate.foundDate === false) is ued because sometimes
//   // A chosen date does not have transactions, like weekends

//   // The first condition of the following if statement means if we reached a day prior the chosen date
//   // And the chosen day was never found, that means it s likely a weekend day
//   // So we set the finished date to true, meaning we can wrap this up
//   if (
//     new Date(transactionDate) - new Date(utilities.chosenDate) < 0 &&
//     foundChosenDate.foundDate === false
//   ) {
//     foundChosenDate.finishedDate = true;
//   }

//   if (transactionDate === utilities.chosenDate) {
//     foundChosenDate.foundDate = true;

//     utilities.dataResults.push({
//       transactionTitle,
//       transactionUrl,
//       transactionDate,
//       transactionImage,
//     });
//   } else if (
//     new Date(transactionDate) - new Date(utilities.chosenDate) < 0 &&
//     foundChosenDate.foundDate === true
//   ) {
//     foundChosenDate.finishedDate = true; // Used to break out of the while loop when condition breaks
//   }
// });

// Need to change TODO

// module.exports = { scrape };

export default {
  scrape,
};
