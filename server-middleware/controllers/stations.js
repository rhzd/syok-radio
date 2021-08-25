const axios = require("axios");
import getSyokToken from "../auth/getSyokToken";
import getStations from "../services/getStations";

export default async function getStationList() {
  try {
    const token = await getSyokToken();
    const data = await getStations(token)
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
