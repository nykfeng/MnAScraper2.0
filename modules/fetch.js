import axios from "axios";

const onePage = async function (url) {
  try {
    const response = await axios(url);
    return response.data;
  } catch (err) {
    console.log("Error");
    console.log(err);
  }
};

export default {
  onePage,
};
