import getRevmaToken from "../auth/getRevmaToken";
import getRaToken from "../auth/getRaToken";

export default async function getStream(link, stationCode, language) {
  try {
    const uri_component = encodeURIComponent(
      `companionads:true;tags:radioactive;stationid:${stationCode}`
    );
    const lang = encodeURIComponent(`["${language}"]`);
    let data;
    if (link.includes("revma")) {
      const token = await getRevmaToken(link);
      data = `${link}?rj-auth=${token}&awparams=${uri_component}&lan=${lang}&setLanguage=true`;
    } else if (link.includes("rastream")) {
      const token = await getRaToken();
      data = `${link}?authtoken=${token}&awparams=${uri_component}&lan=${lang}&setLanguage=true`;
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
