const axios = require("axios");

const onePage = async function (url) {
  const response = await axios(url);

  return response.data;
};

module.exports = { onePage };
