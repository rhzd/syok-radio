const axios = require("axios");

export default async function getSyokToken() {
  try {
    const token = await axios
      .post(`${process.env.SYOK_URL}/authenticate`, null, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SYOK_USERNAME}:${process.env.SYOK_PASSWORD}`
          ).toString("base64")}`
        }
      })
      .then(response => {
        return response.data.data;
      });
    return token;
  } catch (error) {
    throw new Error(error);
  }
}