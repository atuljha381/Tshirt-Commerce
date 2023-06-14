const express = require("express");
const { run } = require("./dao/mongo");
const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

//To connect to MongoDB
run().catch(console.dir);

app.use("/auth", require("./routes/auth0"));
app.get("/", (req, res) => {
  res.send("Hello from TSC");
});
