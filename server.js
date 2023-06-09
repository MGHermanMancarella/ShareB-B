"use strict";
const app = require("./app");
const cors = require("cors");

const { PORT } = require("./config");
app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
})