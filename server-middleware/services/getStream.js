import getRevmaToken from "../auth/getRevmaToken";
import getRaToken from "../auth/getRaToken";

export default async function getStream(link) {
  try {
    let data;
    if (link.includes("revma")) {
      const token = await getRevmaToken(link);
      data = `${link}?rj-auth=${token}`;
    } else if (link.includes("rastream")) {
      const token = await getRaToken();
      data = `${link}?authtoken=${token}`;
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
