import getSyokToken from "../auth/getSyokToken";
import getStream from "../services/getStream";
import getPlayoutHistory from "../services/getPlayoutHistory";
import getStation from "../services/getStation";
import getShows from "../services/getShows";
import showsProc from "../utils/showsProc";
import colorProc from "../utils/colorProc";

export default async function getStationData(id) {
  try {
    const token = await getSyokToken();
    const station = await getStation(token, id);
    const stream = await getStream(
      station.streams.find(x => x.platform === "web").endpoint
    );
    const logo = station.images.find(x => x.name === "square_image").url;
    const landscapeImage = station.images.find(
      x => x.name === "landscape_image"
    ).url;

    let color = {
      primary: "#fb2724",
      secondary: colorProc("#fb2724", -40),
      tertiary: colorProc("#fb2724", 100)
    };

    if (
      station.additionalAttributes &&
      station.additionalAttributes.stationColor
    ) {
      const primaryColor = station.additionalAttributes.stationColor[0].webplayer;
      color.primary = primaryColor;
      color.secondary = await colorProc(primaryColor, -40);
      color.tertiary = await colorProc(primaryColor, 100);
    }

    let playoutHistory = [];
    if (
      station.externalLinks &&
      station.externalLinks.find(x => x.key === "playoutHistory")
    ) {
      playoutHistory = await getPlayoutHistory(
        token,
        station.externalLinks.find(x => x.key === "playoutHistory").url
      );
    }

    let shows = [];
    if (
      station.externalLinks &&
      station.externalLinks.find(x => x.key === "programmes")
    ) {
      let data = await getShows(
        token,
        station.externalLinks.find(x => x.key === "programmes").url
      );
      shows = await showsProc(data, station.name, logo);
    }

    const data = {
      stationCode: station.stationCode,
      name: station.name,
      description: station.description,
      language: station.language,
      stream: stream,
      images: {
        logo: logo,
        landscapeImage: landscapeImage
      },
      color: color,
      shows: shows,
      playoutHistory: playoutHistory
    };

    return data;
  } catch (error) {
    throw new Error(error);
  }
}
