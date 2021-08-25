const jwt = require("jsonwebtoken");

export default async function getRaToken() {
  try {
    const limit = 60 * 60 * 24; // 180 seconds
    const init = Math.floor(Date.now() / 1000);
    const expires = Math.floor(Date.now() / 1000) + limit;
    const payload = {
      exp: expires,
      iat: init,
      oid: process.env.OID_RADIO_STREAM
    };
    const token = jwt.sign(
      payload,
      Buffer.from(process.env.JWT_RADIO_STREAM, "base64")
    );
    return token;
  } catch (error) {
    throw new Error(error);
  }
}
