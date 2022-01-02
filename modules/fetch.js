const axios = require("axios");

// const res = fetch("https://seekingalpha.com/market-news/m-a");
// const data = res.json();
// console.log(data);

// (async () => {
//   console.log(await got.get("https://seekingalpha.com/market-news/m-a"));
// })();

const onePage = async function (url) {
  try {
    const response = await axios(url, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });

    return response.data;
  } catch (err) {
    console.log("Error");
    console.log(err);
  }
};

module.exports = { onePage };
