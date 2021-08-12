import { json } from "body-parser";
const app = require("express")();
const jwt = require("jsonwebtoken");

app.use(json());
app.all("/get-token", (req, res) => {
  let limit = 60 * 60 * 24; // 180 seconds
  let init = Math.floor(Date.now() / 1000);
  let expires = Math.floor(Date.now() / 1000) + limit;
  let payload = {
    exp: expires,
    iat: init,
    oid: process.env.OID_RADIO_STREAM,
  };
  let token = jwt.sign(payload, Buffer.from(process.env.JWT_RADIO_STREAM, "base64"));
  res.json({ data: token });
});

export default app;
