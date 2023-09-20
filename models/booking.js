"use strict";

const db = require("../db");
const { BookingConflictError, BookingError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const intervalToDuration = require("date-fns/intervalToDuration");
import { format } from "date-fns";
intervalToDuration({
  start: new Date(1929, 0, 15, 12, 0, 0),
  end: new Date(1968, 3, 4, 19, 5, 0),
}); // Date(year, month, day, hour, min, sec)

/** Related functions for bookings.
 *
 * Bookings share FKs with a specific a listing's id and the user booking.
 * The bookings table is effectively a through table for listings and base users
 * It's rows are:
 *                { booking_id,
 *                  listing_id,
 *                  booking_user,
 *                  check_in,
 *                  check_out
 *                }
 */

class Booking {
  /** In: data =>  { listing_id,
   *                  booking_user,
   *                  check_in,
   *                  check_out
   *                }
   *
   * Booking dates checked in the database for efficiency.
   * 
   * Throws BookingError if the listing does not exist.
   * Throws BookingConflictError if check_in / check_out out of range
   *
   * Returns { booking_id,
   *           listing_id,
   *           booking_user,
   *           check_in,
   *           check_out
   *         }
   **/

  static async create(data) {
    // Check if listing exists
    const listingPreCheck = await db.query(
      `SELECT listing_id
                FROM listings
                WHERE listing_id = $1`,
      [data.listingID]
    );
    const listing = listingPreCheck.rows[0];

    if (!listing)
      throw new BookingError(
        `I'm sorry, this listing is no longer active: ${data.listingID}`
      );

    // Check dates for availability SELECT * FROM available_slots(1, 'desired_start_date', 'desired_end_date');


    // get available dates: SELECT * FROM available_slots(1, '2023-10-01', '2023-10-31');


    const result = await db.query(
      `INSERT INTO bookings (listing_id,
                              booking_user,
                              check_in,
check_out)
        VALUES ($1, $2, $3)
        RETURNING
            booking_id,
            listing_id,
            booking_user,
            check_in,         
            check_out`,
      [data.listingID, data.username, data.checkIn, data.checkOut]
    );
    const booking = result.rows[0];

    return booking;
  }

  /** Create WHERE clause for filters, to be used by functions that query
   *
   * searchFilters (all optional):
   * - minSalary
   * - hasEquity
   * - title (will find case-insensitive, partial matches)
   *
   * Returns {
   *  where: "WHERE minSalary >= $1 AND title ILIKE $2",
   *  vals: [10000, '%Engineer%']
   * }
   */
  //NOTE: Might not need this
  static _filterWhereBuilder({ minSalary, hasEquity, title }) {
    let whereParts = [];
    let vals = [];

    if (minSalary !== undefined) {
      vals.push(minSalary);
      whereParts.push(`salary >= $${vals.length}`);
    }

    if (hasEquity === true) {
      whereParts.push(`equity > 0`);
    }

    if (title !== undefined) {
      vals.push(`%${title}%`);
      whereParts.push(`title ILIKE $${vals.length}`);
    }

    const where =
      whereParts.length > 0 ? "WHERE " + whereParts.join(" AND ") : "";

    return { where, vals };
  }

  /** Find all bookings by logged in user id.
   *
   * Returns [{ booking_id,
   *            listing_id,
   *            booking_user,
   *            check_in,
   *            check_out
   *          } ...]
   * */

  static async findAll(username) {
    const myBookings = await db.query(
      `
        SELECT  booking_id,
                listing_id,
                booking_user,
                check_in, 
                check_out,
        FROM bookings 
        WHERE booking_user = $1`,
      [username]
    );

    return myBookings.rows;
  }

  /** Given a booking id, return data about listing.
   *
   * Returns { id, title, salary, equity, companyHandle, listing }
   *   where listing is { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BookingConflictError if not found.
   **/

  static async get(id) {
    const jobRes = await db.query(
      `
        SELECT id,
               title,
               salary,
               equity,
               company_handle AS "companyHandle"
        FROM bookings
        WHERE id = $1`,
      [id]
    );

    const booking = jobRes.rows[0];

    if (!booking) throw new BookingConflictError(`No booking: ${id}`);

    const companiesRes = await db.query(
      `
        SELECT handle,
               name,
               description,
               num_employees AS "numEmployees",
               logo_url      AS "logoUrl"
        FROM companies
        WHERE handle = $1`,
      [booking.companyHandle]
    );

    delete booking.companyHandle;
    booking.listing = companiesRes.rows[0];

    return booking;
  }

  /** Update booking data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws BookingConflictError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE bookings
        SET ${setCols}
        WHERE id = ${idVarIdx}
        RETURNING id,
            title,
            salary,
            equity,
            company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const booking = result.rows[0];

    if (!booking) throw new BookingConflictError(`No booking: ${id}`);

    return booking;
  }

  /** Delete given booking from database; returns undefined.
   *
   * Throws BookingConflictError if listing not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
         FROM bookings
         WHERE id = $1
         RETURNING id`,
      [id]
    );
    const booking = result.rows[0];

    if (!booking) throw new BookingConflictError(`No booking: ${id}`);
  }
}

module.exports = Booking;
