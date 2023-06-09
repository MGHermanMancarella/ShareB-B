"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, listings }
   *    where listings is [{listing_id, price, description, photo_url}]
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    console.log("MADE IT HERE");
    const result = await db.query(
      `
      SELECT u.username,
             u.password,
             u.first_name AS "firstName",
             u.last_name AS "lastName",
             u.email,
             u.bookings,
             l.listing_id,
             l.price,
             l.description,
             l.photo_url
      FROM users u
      LEFT JOIN listings l ON u.username = l.host_user
      WHERE u.username = $1`,
      [username]
    );

    const user = result.rows[0];
    console.log("user ===> ", user);

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        const listings = [];


        if (user.bookings) {

        listings = user.map(
          ({ listing_id, price, description, photo_url }) => ({
            listing_id,
            price,
            description,
            photo_url,
          })
        )
        }


        return {
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          listings: listings
        };
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `
        SELECT username
        FROM users
        WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `
                INSERT INTO users
                (username,
                 password,
                 first_name,
                 last_name,
                 email
                 )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING
                    username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email`,
      [username, hashedPassword, firstName, lastName, email]
    );

    const user = result.rows[0];

    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `
        DELETE
        FROM users
        WHERE username = $1
        RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  //TODO:
  /** Bookings: update db, returns undefined.
   *
   * - username: username applying for job
   * - jobId: job id
   **/

  static async applyToJob(username, jobId) {
    const preCheck = await db.query(
      `
        SELECT id
        FROM jobs
        WHERE id = $1`,
      [jobId]
    );
    const job = preCheck.rows[0];

    if (!job) throw new NotFoundError(`No job: ${jobId}`);

    const preCheck2 = await db.query(
      `
        SELECT username
        FROM users
        WHERE username = $1`,
      [username]
    );
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No username: ${username}`);

    await db.query(
      `
        INSERT INTO applications (job_id, username)
        VALUES ($1, $2)`,
      [jobId, username]
    );
  }
}

module.exports = User;

