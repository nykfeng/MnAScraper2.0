import helper from "./helper.js";
import utilities from "./utilities.js";
import puppeteer from "puppeteer";

const getData = async function () {
  const axiosProRataUrl = utilities.axiosProRataUrl;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(axiosProRataUrl);

  // wait for javascript rendered data to load
  await page.waitForTimeout(3000);

  // Targeting the HTML element containing each article
  await page.waitForSelector(".h6");

  const transactions = await page.evaluate(() => {
    const result = [];

    const sectionEls = document.querySelectorAll(".h6");

    sectionEls.forEach((section) => {
      if (section.textContent === "Private Equity Deals") {
        let targetEl;

        // Sometimes the site will include a gif file before the article div
        if (section.nextElementSibling.querySelector('amp-img')) {
          targetEl = section.nextElementSibling.nextElementSibling;
        } else {
          targetEl = section.nextElementSibling;
        }
        const paragraphEls = targetEl.querySelectorAll("p");
        paragraphEls.forEach((paragraph) => {
          result.push(paragraph.textContent);
        });
      } else if (section.textContent === "More M&A") {
        let targetEl;

        // Sometimes the site will include a gif file before the article div
        if (section.nextElementSibling.querySelector('amp-img')) {
          targetEl = section.nextElementSibling.nextElementSibling;
        } else {
          targetEl = section.nextElementSibling;
        }
        const paragraphEls = targetEl.querySelectorAll("p");
        paragraphEls.forEach((paragraph) => {
          result.push(paragraph.textContent);
        });
      }
    });

    return result;
  });

  await browser.close();

  transactions.forEach((transaction) => {
    utilities.dataResults.push({
      transactionTitle: helper.removeUrlFromAxiosParagraph(transaction),
      transactionUrl: utilities.axiosProRataUrl,
      transactionDate: helper.getDate(new Date()),
      transactionImage: "",
    });
  });
};

export default {
  getData,
};
