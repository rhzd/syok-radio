const axios = require("axios");

export default async function getPlayoutHistory(token, url) {
  try {
    let data = [];
    const playoutHistory = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        // console.log(response.data.data);
        return response.data.data;
      });
      playoutHistory.forEach(el => {
      data.push({
        track: el.song.track,
        artist: el.song.artist,
        coverUrl: el.song.coverUrl ? el.song.coverUrl : null
      });
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
