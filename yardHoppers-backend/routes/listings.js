"use strict";

/** Routes for listings. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Company = require("../models/listing");

const listingNewSchema = require("../schemas/listingNew.json");
const listingUpdateSchema = require("../schemas/listingUpdate.json");
const listingSearchSchema = require("../schemas/listingSearch.json");

const router = new express.Router();

/** POST / { listing } =>  { listing }
 *
 * listing should be { host_user,
 *                     price,
 *                     description,
 *                     photo_url }
 *
 * Returns { listing_id,
 *           host_user,
             price,
             description,
             photo_url }
 *
 * Authorization required: token (registered user)
 */

router.post("/", async function (req, res, next) {
  const validator = jsonschema.validate(req.body, listingNewSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  const listing = await Company.create(req.body);
  return res.status(201).json({ listing });
});

/** GET /  =>
 * [{ listing_id, host_user, price, description, photo_url } ...]
 *
 * Can filter on provided search filters:
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;

  const validator = jsonschema.validate(q, listingSearchSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  const listings = await Company.findAll(q);
  return res.json({ listings });
});

/** GET /[handle]  =>  { listing }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  const listing = await Company.get(req.params.handle);
  return res.json({ listing });
});

/** PATCH /[handle] { fld1, fld2, ... } => { listing }
 *
 * Patches listing data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: admin
 */

router.patch("/:handle", ensureAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, listingUpdateSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  const listing = await Company.update(req.params.handle, req.body);
  return res.json({ listing });
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
  await Company.remove(req.params.handle);
  return res.json({ deleted: req.params.handle });
});

module.exports = router;
