export default async function showsProc(showsData, stationName, stationLogo) {
  try {
    const days = [
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
    const d = new Date();
    const dayName = days[d.getDay()];
    const dayNameTomorrow = days[d.getDay() + 1];
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

    const time = new Date();
    const minute =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    const formattedTime = time.getHours() + "" + minute;

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
        name: stationName,
        image: stationLogo,
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
      const startTime = [a.slice(0, position), divider, a.slice(position)].join(
        ""
      );
      const endTime = [b.slice(0, position), divider, b.slice(position)].join(
        ""
      );

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
  } catch (error) {
    throw new Error(error);
  }
}
