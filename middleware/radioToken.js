export default function() {
  const jwt = require("jsonwebtoken");
  const jwt_key = "ARMVSgCp2lyFPA9FRjGCcgLp7ZkfyFWoifSKcYjpk8w";
  const oid = "era-youtube";

  let limit = 60 * 60 * 24; // 180 seconds
  let init = Math.floor(Date.now() / 1000);
  let expires = Math.floor(Date.now() / 1000) + limit;
  let payload = {
    exp: expires,
    iat: init,
    oid: oid,
  };
  let token = jwt.sign(payload, Buffer.from(jwt_key, "base64"));
}
