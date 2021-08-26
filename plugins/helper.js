export default ({ app }, inject) => {
  inject("suggestion", (stationList, language, stationCode, gotPlayoutHistory) => {
    let suggestion = [];
    if (language !== "en") {
      stationList.forEach(el => {
        if (el.language == language && el.stationCode !== stationCode) {
          suggestion.push(el);
        }
      });
    }

    stationList.forEach(el => {
      if (el.language == "en" && el.stationCode !== stationCode) {
        suggestion.push(el);
      }
    });

    const parent = stationList
      .find(element => element.stationCode == stationCode)
      .name.toLowerCase()
      .split(" ")[0];

    let mainStation = [];
    let langStation = [];
    let otherStation = [];

    suggestion.forEach(el => {
      if (el.name.toLowerCase().split(" ")[0] == parent) {
        mainStation.push(el);
      } else {
        if (el.language == language) {
          langStation.push(el);
        } else {
          otherStation.push(el);
        }
      }
    });

    mainStation.sort((a, b) => {
      return a.name.length - b.name.length;
    });

    langStation.sort((a, b) => {
      return a.name.length - b.name.length;
    });

    otherStation.sort((a, b) => {
      return a.name.length - b.name.length;
    });

    let data = [];

    [...mainStation, ...langStation, ...otherStation].forEach(el => {
      data.push({
        stationCode: el.stationCode,
        name: el.name,
        logo: el.logo
      });
    });

    return gotPlayoutHistory ? data.slice(0, 4) : data.slice(0, 6)
  });
};
