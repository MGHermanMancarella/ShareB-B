//  msg_id │ listing_id │ from_user │ read │ msg_body
"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for bookings. 
 * 
 * Messages share FKs with a specific a listing's id and the user sending the msg.
 * It's rows are: { id, listingID, fromUser(id), read, msgBody }
 * 
 *                { id,
 *                  booking_id, 
 *                  listing_id, 
 *                  booking_user, 
 *                  check_in_date, 
 *                  check_out_date 
 *                }
*/

class Booking {
  /** Create a booking (from data), update db, return new booking data.
   *
   * data should be { listingID, fromUser(id), read(bool), msgBody }
   *
   * Throws NotFoundError if the listing does not exist.
   *
   * Returns { id, listingID, fromUser(id), read, msgBody }
   * 
   * 

   **/

  static async create(data) {
    const listingPreCheck = await db.query(`
                SELECT listing_id
                FROM listings
                WHERE listing_id = $1`,
        [data.listingID]);
    const listing = listingPreCheck.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${data.listingID}`);

    const result = await db.query(`
        INSERT INTO bookings (listing_id,
                              from_user,
                              read,
                              msg_body)
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            listing_id,
            from_user,
            read,
            msg_body`, [
      data.listingID,
      data.fromUser,
      data.read,
      data.msgBody,
    ]);
    const booking = result.rows[0];

    return booking;
  }}