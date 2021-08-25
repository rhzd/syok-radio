const axios = require("axios");

export default async function getStations(token) {
  try {
    const data = await axios
      .get(`${process.env.SYOK_URL}/radio/stations`, {
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
