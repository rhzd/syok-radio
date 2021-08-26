import { json } from "body-parser";
const app = require("express")();
import station from "./controllers/station";
import stations from "./controllers/stations";

app.use(json());
app.get("/station/:id", async (req, res, next) => {
  try {
    const data = await station(req.params.id);
    res.json({ data: data });
  } catch (error) {
    next(new Error(error))
  }
});

app.get("/stations", async (req, res, next) => {
  try {
    const data = await stations();
    res.json({ data: data });
  } catch (error) {
    next(new Error(error))
  }
});

export default app;
