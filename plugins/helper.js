export default ({ app }, inject) => {
  inject("colorChange", (col, amt) => {
    var usePound = false;

    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    var R = parseInt(col.substring(0, 2), 16);
    var G = parseInt(col.substring(2, 4), 16);
    var B = parseInt(col.substring(4, 6), 16);

    // to make the colour less bright than the input
    // change the following three "+" symbols to "-"
    R = R + amt;
    G = G + amt;
    B = B + amt;

    if (R > 255) R = 255;
    else if (R < 0) R = 0;

    if (G > 255) G = 255;
    else if (G < 0) G = 0;

    if (B > 255) B = 255;
    else if (B < 0) B = 0;

    var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
    var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
    var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

    return (usePound ? "#" : "") + RR + GG + BB;
  });

  inject("showsObject", (showsData, stationData) => {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    let showsFiltered = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    };
    let d = new Date();
    let dayName = days[d.getDay()];
    let dayNameTomorrow = days[d.getDay() + 1];
    showsData.forEach(show => {
      const days = show.Day.split("|");
      days.forEach(el => {
        showsFiltered[el].push({
          day: el,
          name: show.name,
          image: show.SquareImage,
          startTime: show.StartHour,
          endTime: show.EndHour
        });
      });
    });

    var time = new Date();
    let minute =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    let formattedTime = time.getHours() + "" + minute;

    let finalShows = [
      ...showsFiltered.Sunday.sort((a, b) => a.startTime - b.startTime),
      ...showsFiltered.Monday.sort((a, b) => a.startTime - b.startTime),
      ...showsFiltered.Tuesday.sort((a, b) => a.startTime - b.startTime),
      ...showsFiltered.Wednesday.sort((a, b) => a.startTime - b.startTime),
      ...showsFiltered.Thursday.sort((a, b) => a.startTime - b.startTime),
      ...showsFiltered.Friday.sort((a, b) => a.startTime - b.startTime),
      ...showsFiltered.Saturday.sort((a, b) => a.startTime - b.startTime)
    ];

    const currentShowIndex = finalShows.findIndex(
      show =>
        show.day === dayName &&
        Number(show.startTime) <= Number(formattedTime) &&
        Number(show.endTime) >= Number(formattedTime)
    );

    const noCurrentShowIndex = finalShows.findIndex(
      show =>
        show.day == dayName && Number(show.startTime) > Number(formattedTime)
    );

    const noCurrentShowTodayIndex = finalShows.findIndex(
      show => show.day == dayNameTomorrow
    );

    let currentShow;

    if (currentShowIndex !== -1) {
      currentShow = finalShows[currentShowIndex];
    } else {
      currentShow = {
        day: "Everyday",
        name: stationData.name,
        image: stationData.images.find(x => x.name === "square_image").url,
        startTime: "00:00",
        endTime: "00:00"
      };
    }

    let upcomingShow = [];
    let upcomingShowAfter = [];

    let currentIndex = null;

    if (currentShowIndex !== -1) {
      currentIndex = currentShowIndex;
    } else {
      if (noCurrentShowIndex !== -1) {
        currentIndex = noCurrentShowIndex;
      } else {
        if (noCurrentShowTodayIndex !== -1) {
          currentIndex = noCurrentShowTodayIndex;
        }
      }
    }

    finalShows.forEach((show, index) => {
      let a;
      let b;

      if (show.startTime.toString().length == 1) {
        a = "000" + show.startTime.toString();
      } else if (show.startTime.toString().length == 3) {
        a = "0" + show.startTime.toString();
      } else {
        a = show.startTime.toString();
      }

      if (show.endTime.toString().length == 1) {
        b = "000" + show.endTime.toString();
      } else if (show.endTime.toString().length == 3) {
        b = "0" + show.endTime.toString();
      } else {
        b = show.endTime.toString();
      }

      const divider = ":";
      const position = 2;
      let startTime = [a.slice(0, position), divider, a.slice(position)].join(
        ""
      );
      let endTime = [b.slice(0, position), divider, b.slice(position)].join("");

      let day;
      if (show.day === dayName) {
        day = "Today";
      } else if (show.day === dayNameTomorrow) {
        day = "Tomorrow";
      } else {
        day = show.day;
      }
      show.day = day;
      show.startTime = startTime;
      show.endTime = endTime;
      if (currentShowIndex == -1) {
        if (index >= currentIndex) {
          upcomingShow.push(show);
        } else {
          if (show.day !== "Today" && show.day !== "Tomorrow") {
            upcomingShowAfter.push(show);
          }
        }
      } else {
        if (index > currentIndex) {
          upcomingShow.push(show);
        } else {
          if (show.day !== "Today" && show.day !== "Tomorrow") {
            upcomingShowAfter.push(show);
          }
        }
      }
    });

    upcomingShow = [...upcomingShow, ...upcomingShowAfter];

    return {
      currentShow,
      upcomingShow
    };
  });

  inject("moreFromUsObject", (stationList, stationData, paramsId) => {
    let moreFromUsData = [];
    if (stationData.language !== "en") {
      stationList.forEach(el => {
        if (
          el.language == stationData.language &&
          el.stationCode !== paramsId
        ) {
          moreFromUsData.push(el);
        }
      });
    }

    stationList.forEach(el => {
      if (el.language == "en" && el.stationCode !== paramsId) {
        moreFromUsData.push(el);
      }
    });

    let parent = stationList
      .find(element => element.stationCode == paramsId)
      .name.toLowerCase()
      .split(" ")[0];

    let mainStation = [];
    let langStation = [];
    let otherStation = [];

    moreFromUsData.forEach(el => {
      if (el.name.toLowerCase().split(" ")[0] == parent) {
        mainStation.push(el);
      } else {
        if (el.language == stationData.language) {
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

    return [...mainStation, ...langStation, ...otherStation];
  });
};
