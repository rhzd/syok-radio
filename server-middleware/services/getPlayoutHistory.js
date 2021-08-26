const axios = require("axios");

export default async function getPlayoutHistory(token, url, stationLogo) {
  try {
    let data = [];
    const playoutHistory = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        return response.data.data;
      });
      playoutHistory.forEach(el => {
      data.push({
        id: el.song.id,
        track: el.song.track,
        artist: el.song.artist,
        coverUrl: el.song.coverUrl ? el.song.coverUrl : stationLogo
      });
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
