// const { builtinModules } = require("module");

const getDate = function (date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

const fixDateString = function (dateString) {
  // November 05, 2021 22:59 ET taking this date format and return November 05, 2021
  return dateString.substring(0, dateString.lastIndexOf(" "));
};

const fixPRNewswireTitleString = function (titleString) {
  return titleString
    .substring(titleString.indexOf("</small>") + 8, titleString.length)
    .replace(/\n/g, "");
};

const seekingalphaDateStrModify = function (dateText) {
  if (dateText.toLowerCase().includes("today")) {
    return new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  } else if (dateText.toLowerCase().includes("yesterday")) {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toLocaleString("en-US", { timeZone: "America/New_York" });
  } else {
    return new Date(dateText) || undefined;
  }
};

const dayRangeValidation = function (chosenDate) {
  const today = new Date();
  const pickedDate = new Date(chosenDate);

  const dayRange = Math.floor((today - pickedDate) / (1000 * 3600 * 24));

  return dayRange < 0 ? false : dayRange > 3 ? false : true;
};

const createGoogleSearchLink = function (searchText) {
  let googleUrl = "https://www.google.com/search?q=";
  return googleUrl + searchText.replace(/ /g, "+");
};


const removeUrlFromAxiosParagraph = function(paragraph) {
  if(paragraph.includes('http')) {
    paragraph = paragraph.substring(0, paragraph.indexOf('http'));
  } else if (paragraph.includes('www.')) {
    paragraph = paragraph.substring(0, paragraph.indexOf('www.'));
  } 
  return paragraph;
}


export default {
  getDate,
  fixDateString,
  fixPRNewswireTitleString,
  dayRangeValidation,
  seekingalphaDateStrModify,
  createGoogleSearchLink,
  removeUrlFromAxiosParagraph
};
