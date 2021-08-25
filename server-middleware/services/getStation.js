const axios = require("axios");

export default async function getStation(token, id) {
  try {
    const data = await axios
      .get(`${process.env.SYOK_URL}/radio/streams/${id}`, {
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
