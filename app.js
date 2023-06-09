"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const { authenticateJWT } = require("./middleware/auth");
const { NotFoundError } = require("./expressError");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const userRouteS = require("./routes/users");


app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);
app.use("/users", userRouteS);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
