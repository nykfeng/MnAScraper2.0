const businesswireUrl =
  "https://www.businesswire.com/portal/site/home/news/subject/?vnsId=31333";
const globenewswireUrl =
  "https://www.globenewswire.com/search/subject/mna?page=1";
const prnewswireUrl =
  "https://www.prnewswire.com/news-releases/financial-services-latest-news/acquisitions-mergers-and-takeovers-list/?page=1&pagesize=100";
const biospaceUrl = "https://www.biospace.com/news/mergers-and-acquisitions/";

const seekingAlphaUrl = "https://seekingalpha.com/market-news/m-a";

const axiosProRataUrl = "https://www.axios.com/newsletters/axios-pro-rata";

let chosenDate;
let dataResults = []; //To store transaction title, url, date, image

let transactionCount = 0; // Counting the total number of transaction for the day

// This is used to find if the algo found the desired date and then finished going thru the same date
const foundChosenDate = {
  foundDate: false, // Found the chosen date
  finishedDate: false, // Read all the chosen date data until it reached an earlier date (meaning end of reading)
};



export default {
  businesswireUrl,
  globenewswireUrl,
  prnewswireUrl,
  seekingAlphaUrl,
  axiosProRataUrl,
  biospaceUrl,
  chosenDate,
  transactionCount,
  foundChosenDate,
  dataResults,
};
