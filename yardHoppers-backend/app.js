"use strict";

/** Express app for jobly. */

const express = require("express");
// const cors = require("cors");
require("dotenv").config();
console.log("AWS_ACCESS_KEY ===> ", process.env.AWS_SECRET_KEY)

const uploadRoutes = require("./routes/upload");
const authRoutes = require('./routes/auth');

const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/upload", uploadRoutes);
app.use('/auth', authRoutes);


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
