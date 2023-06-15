const express = require("express");
const { connectMongo } = require("./dao/mongo");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`TSC app listening on port http://localhost:${port}`);
});

/**
 * To Connect to Mongo DB
 */
connectMongo().catch(console.dir);

app.use("/auth", require("./routes/auth0"));
app.use("/customer", require("./routes/customer"));

app.get("/", (req, res) => {
  res.send("Hello from TSC");
});
