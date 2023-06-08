"use strict";

const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

function sqlWhereClause(filterBy, jsToSql) {
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

module.exports = { sqlForPartialUpdate, sqlWhereClause };
