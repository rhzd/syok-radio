const axios = require("axios");

export default async function getRevmaToken(link) {
  try {
    const path = new URL(link).pathname;
    const token = await axios
      .get(
        `https://www.revma.com/api/stations/${
          path.split("/")[1]
        }/private_stream_token?minutes=1440`,
        {
          headers: {
            "x-auth-token": "1598352525wMVCYpxLcUBjGSkS7dHq"
          }
        }
      )
      .then(response => {
        return new URL(response.data).searchParams.get("rj-auth");
      });
    return token;
  } catch (error) {
    throw new Error(error);
  }
}
