import fetch from "./fetch.js";
import cheerio from "cheerio";
import helper from "./helper.js";
import utilities from "./utilities.js";
import languageDetect from "languagedetect";

const scrape = async function () {
  let businesswireUrl = utilities.businesswireUrl;

  // This is used to find if the algo found the desired date and then finished going thru the same date
  const foundChosenDate = {
    foundDate: false, // Found the chosen date
    finishedDate: false, // Read all the chosen date data until it reached an earlier date (meaning end of reading)
  };

  // While we haven't finished reading the chosen date's data, we continue
  while (!foundChosenDate.finishedDate) {
    console.log(`Now reading URL -- ${businesswireUrl}`);
    const html = await fetch.onePage(businesswireUrl);
    const $ = cheerio.load(html);
    const lngDetector = new languageDetect();

    try {
      // Targeting the HTML element containing each article
      $(".bwNewsList li", html).each(function () {
        let transactionTitle = $(this)
          .find("span[itemprop*='headline']")
          .text();
        let transactionUrl =
          "https://businesswire.com" + $(this).find("a").attr("href");
        let transactionDate = helper.getDate(
          new Date($(this).find("time").attr("datetime"))
        );
        let transactionImage = $(this).find(".bwThumbs img").attr("src") || "";
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
          utilities.foundChosenDate.foundDate = true;
          if (titleLanguage === "english") {
            // We are only interested in English articles
            utilities.dataResults.push({
              transactionTitle,
              transactionUrl,
              transactionDate,
              transactionImage,
            });
          }
        } else if (
          new Date(transactionDate) - new Date(utilities.chosenDate) < 0 &&
          foundChosenDate.foundDate === true
        ) {
          foundChosenDate.finishedDate = true;
        }
      });
    } catch (err) {
      console.log(err);
    }

    businesswireUrl = `https://www.businesswire.com${
      $("#paging .pagingNext a").attr("href") || ""
    }`;
  }
};

const scrape2 = async function () {
  let businesswireUrl = utilities.businesswireUrl;
  const transactions = [];

  const browser = await puppeteer.launch();


    const page = await browser.newPage();
    await page.goto(businesswireUrl);

    // wait for javascript rendered data to load
    await page.waitForTimeout(3000);

    // Targeting the HTML element containing each article
    await page.waitForSelector(".bwNewsList li");

    const data = await page.evaluate(() => {
      const result = [];
      const articleEls = document.querySelectorAll(".bwNewsList li");

      articleEls.forEach((articleEl) => {
        const transactionTitle = articleEl.querySelector("span[itemprop*='headline']").textContent;
        const transactionUrl = "https://businesswire.com" + articleEl.querySelector("a").href;
        const transactionDate = articleEl.querySelector('time').getAttribute('datetime');
        const transactionImage = articleEl.querySelector(".bwThumbs img").getAttribute("src")  || "";

        result.push({
          transactionTitle,
          transactionDate,
          transactionUrl,
          transactionImage,
        });
      });

      businesswireUrl = `https://www.businesswire.com${
        document.querySelector("#paging .pagingNext a").href || ""
      }`;

      return result;
    });

    await page.close();

    // to validate the scraped transactions and format data
    data.forEach( d=> {
      d.transactionDate = helper.getDate(d.transactionDate)
    })
    
    transactions.push(...data);


    
    
}


export default {
  scrape,
};
