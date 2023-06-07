"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlWhereClause } = require("../helpers/sql");

/** Related functions for listings. */

class Listing {
  /** Create a Listing (from data), update db, return new listing data.
   *
   * data should be { listing_id, host_user, price, description, photo_url }
   *
   * Returns { listing_id, host_user, price, description, photo_url }
   *
   * Throws BadRequestError if listing already in database.
   * */

  static async create({ host_user, price, description, photo_url }) {
    // const duplicateCheck = await db.query(
    //   `
    //     SELECT handle
    //     FROM listings
    //     WHERE handle = $1`,
    //   [handle]
    // )

    // if (duplicateCheck.rows[0])
    //   throw new BadRequestError(`Duplicate listing: ${handle}`)

    const result = await db.query(
      `
                INSERT INTO listings (host_user, 
                                        price, 
                                        description, 
                                        photo_url)
                VALUES ($1, $2, $3, $4)
                RETURNING
                listing_id, 
                host_user, 
                price, 
                description, 
                photo_url`,
      [host_user, price, description, photo_url]
    );
    const listing = result.rows[0];

    return listing;
  }

  /** Find all listings by default. Accepts search terms in the query string.
   *
   * Returns [{ listing_id, host_user, price, description, photo_url } ...]
   *
   * Acceptable search terms:
   *   nameLike: string
   *
   * Throws NotFoundError if not found.
   *
   **/

  static async findAll(filter = {}) {
    // if (filter.minEmployees > filter.maxEmployees) {
    //   throw new BadRequestError(
    //     "minEmployees cannot be larger than maxEmployees"
    //   );
    // }

    const { whereClause, filterValues } = sqlWhereClause(filter, {
      nameLike: "name ILIKE",
    });

    const listingsRes = await db.query(
      `
        SELECT listing_id, 
        host_user, 
        price, 
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
                description, 
                photo_url 
                }
   *   
   * Throws NotFoundError if not found.
   **/

  static async get(listing_id) {
    const listingRes = await db.query(
      `
      SELECT 
            listing_id, 
            host_user, 
            price, 
            description, 
            photo_url
      FROM listings
      WHERE listing_id = $1`,
      [listing_id]
    );

    const listing = listingRes.rows;

    if (!listing) throw new NotFoundError(`No listing: ${listing_id}`);

    return listing;
  }

  /** Update listing data with `data`.
   * 
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      photoUrl: "photo_url"
    });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE listings
        SET ${setCols}
        WHERE handle = ${handleVarIdx}
        RETURNING
        listing_id,
        host_user,
        price,
        description,
        photo_url as photoUrl`;
    const result = await db.query(querySql, [...values, handle]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${handle}`);

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

    if (!listing) throw new NotFoundError(`No listing: ${handle}`);
  }

  /**  Accepts an object of keys to filter by.
   *      nameLike (will find case-insensitive, partial matches)
   *      minEmployees
   *      maxEmployees
   *
   *  Also accepts a list of keys with values of equivalent SQL phrases
   *
   *  Returns an object containing a SQL WHERE clause and values to be inserted
   *  into this clause via a parameterized array
   *
   *  Input ex:
   *     ({"minEmployees":10, "maxEmployees":100, "nameLike":"net"},
   *     {minEmployees: 'employees <', maxEmployees: 'employees >',
   *     nameLike: 'name ILIKE'}
   *
   *  Returns:
   *   {
   *  whereClause: 'WHERE num_employees > $1 AND num_employees < $2 AND name ILIKE $3'
   *  filterValues: [10, 100, "'%net%'"]
   *   }
   */

  static sqlWhereClause(filterBy, jsToSql) {
    let keys = Object.keys(filterBy);
    if (keys.length === 0) {
      return { whereClause: "", filterValues: [] };
    }

    // Add %% to name search query
    if ("nameLike" in filterBy) {
      filterBy["nameLike"] = "%" + filterBy["nameLike"] + "%";
    }
    // if ("title" in filterBy) {
    //   filterBy["title"] = "%" + filterBy["title"] + "%";
    // }
    // if ("hasEquity" in filterBy) {
    //   if (filterBy["hasEquity"] === true) {
    //     filterBy["hasEquity"] = 0;
    //   }
    //   if (filterBy["hasEquity"] === false) {
    //     delete filterBy.hasEquity;
    //     keys = Object.keys(filterBy);
    //   }
    // }

    // sqlClauses is an array of strings that can proceed WHERE in an SQL query
    const sqlClauses = keys.map(
      (colName, idx) => `${jsToSql[colName]} $${idx + 1}`
    );

    return {
      whereClause: "WHERE " + sqlClauses.join(" AND "),
      filterValues: Object.values(filterBy),
    };
  }
}

module.exports = Listing;
