const axios = require("axios");

export default async function getShows(token, url) {
  try {
    // let data = [];
    const data = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        // console.log(response.data.data);
        return response.data.data;
      });
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
