const axios = require("axios");

export default async function getShows(token, url) {
  try {
    const data = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return response.data.data;
      });
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
