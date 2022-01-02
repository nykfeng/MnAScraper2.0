const { builtinModules } = require("module");

const getDate = function (date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

const getDateFromSeekingAlpha = function (dateStr) {
  if (dateStr.toLowerCase().includes("today")) {
    return new Date();
  }
  if (dateStr.toLowerCase().includes("yesterday")) {
    let date = new Date();
    return date.setDate(date.getDate() - 1);
  }
  return new Date(dateStr) || undefined;
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

module.exports = {
  getDate,
  fixDateString,
  fixPRNewswireTitleString,
  getDateFromSeekingAlpha,
};
