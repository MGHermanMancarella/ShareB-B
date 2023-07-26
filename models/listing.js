"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlWhereClause } = require("../helpers/sql");

/** Related functions for listings. */

class Listing {
  /** Create a Listing (from data), update db, return new listing data.
   *
   * data should be { host_user,
   *                  price,
   *                  title,
   *                  description,
   *                  photo_url,
   *                  city,
   *                  state,
   *                  zipcode,
   *                  address
   *                 }
   *
   * Returns { listing_id,
   *           host_user,
   *           price,
   *           title,
   *           description,
   *           photo_url,
   *           city,
   *           state,
   *           zipcode,
   *          }
   *
   * Throws BadRequestError if listing already in database.
   * */

  static async create({
    host_user,
    title,
    price,
    description,
    photo_url,
    city,
    state,
    zipcode,
    address,
  }) {
    const duplicateCheck = await db.query(
      `
        SELECT address
        FROM listings
        WHERE address = $1`,
      [address]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        `Duplicate listing at this address: ${address}`
      );

    const result = await db.query(
      `
                INSERT INTO listings (host_user,
                                        title,
                                        price,
                                        city,
                                        state,
                                        zipcode,
                                        address,
                                        description,
                                        photo_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING
                title,
                listing_id,
                host_user,
                price,
                city,
                state,
                zipcode,
                description,
                photo_url`,
      [host_user, title, price, city, state, zipcode, address, description, photo_url]
    );
    const listing = result.rows[0];

    return listing;
  }

  /** Find all listings by default. Accepts search terms in the query string.
   *
   * Returns [{ listing_id,
   *             host_user,
   *             title,
   *             price,
   *             description,
   *             photo_url,
   *             city,
   *             state,
   *             zipcode,
   *             description,
   *             photo_url,
   *            } ...]
   *
   * Acceptable search terms:
   *    - any values from listings
   *
   * Throws NotFoundError if not found.
   *
   **/

  static async findAll(filter = {}) {
    const { whereClause, filterValues } = sqlWhereClause(filter, {
      listingId: "listing_id",
      hostUser: "host_user",
      photoUrl: "photo_url",
    });
    console.log("whereClause, filterValues", whereClause, filterValues);

    const listingsRes = await db.query(
      `
        SELECT listing_id,
        host_user,
        price,
        title,
        city,
        state,
        zipcode,
        description,
        photo_url
        FROM listings
        ${whereClause}
        ORDER BY listing_id`,
      [...filterValues]
    );

    return listingsRes.rows;
  }

  /** Given a listing_id, return data about listing.
   *
   * Returns { listing_id,
                host_user,
                price,
                title,
                city,
                state,
                zipcode,
                description,
                photo_url
                }
   *
   * Throws NotFoundError if not found.
   **/

  static async getListId(listing_id) {
    const listingRes = await db.query(
      `
      SELECT
            listing_id,
            host_user,
            price,
            title,
            city,
            state,
            zipcode,
            description,
            photo_url
      FROM listings
      WHERE listing_id = $1`,
      [listing_id]
    );

    const listing = listingRes.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${listing_id}`);

    return listing;
  }

  /** Given a username, return data about their listings.
   *
   * Returns [ { listing_id,
   *              price,
   *              title,
   *              description,
   *              photo_url
   *            }...
   *          ]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(username) {
    const listingRes = await db.query(
          `SELECT listing_id,
                  price,
                  title,
                  description,
                  photo_url,
                  host_user
          FROM listings WHERE host_user = $1
          ORDER BY listing_id`,
      [username]
    );

    const listings = listingRes.rows;

    if (!listings) throw new NotFoundError(`No listings by: ${username}`);

    return listings;
  }

  /** Update listing data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {
        price,
        title,
        description,
        photo_url
      }
   *
   * Returns {
        listing_id,
        host_user,
        price,
        title,
        description,
        photo_url
      }
   *
   * Throws NotFoundError if not found.
   */
  //TODO: photo will need to be async and upload to s3 and then return the url
  // it's gonna be a whole thing.

  static async update(listingId, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      listingId: "listing_id",
      hostUser: "host_user",
      photoUrl: "photo_url",
    });
    const listingIdVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE listings
        SET ${setCols}
        WHERE listing_id = ${listingIdVarIdx}
        RETURNING
        listing_id,
        host_user,
        price,
        title,
        description,
        photo_url as photoUrl`;
    const result = await db.query(querySql, [...values, listingId]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${listingId}`);

    return listing;
  }

  /** Delete given listing from database; returns undefined.
   *
   * Throws NotFoundError if listing not found.
   **/

  static async remove(listing_id) {
    const result = await db.query(
      `
        DELETE
        FROM listings
        WHERE listing_id = $1
        RETURNING listing_id`,
      [listing_id]
    );
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${listingId}`);
  }
}

/**static sqlWhereClause(filterBy, jsToSql) {
  let keys = Object.keys(filterBy);
  if (keys.length === 0) {
    return { whereClause: "", filterValues: [] };
  }

  // Add %% to description, city and state search query
  if ("descriptionLike" in filterBy) {
    filterBy["descriptionLike"] = "%" + filterBy["descriptionLike"] + "%";
  }
  if ("city" in filterBy) {
    filterBy["city"] = "%" + filterBy["city"] + "%";
  }
  if ("state" in filterBy) {
    filterBy["state"] = "%" + filterBy["state"] + "%";
  }

  // sqlClauses is an array of strings that can proceed WHERE in an SQL query
  const sqlClauses = keys.map(
    (colName, idx) => `${jsToSql[colName]} ILIKE $${idx + 1}`
  );

  return {
    whereClause: "WHERE " + sqlClauses.join(" AND "),
    filterValues: Object.values(filterBy),
  };
}
 */

module.exports = Listing;
