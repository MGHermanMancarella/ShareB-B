"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");

/** return signed JWT {username} from user data. */

function createToken(user) {
  let payload = {
    username: user.username,
    password: user.password,
  };
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
