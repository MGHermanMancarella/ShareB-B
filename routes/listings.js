"use strict";

/** Routes for listings. */

const jsonschema = require("jsonschema");
const express = require("express");
const multer = require("multer");

const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const {
  ensureCorrectUserOrAdmin,
  ensureLoggedIn,
} = require("../middleware/auth");
const { uploadPhoto } = require("../helpers/upload");
const Listing = require("../models/listing");

const listingNewSchema = require("../schemas/listingNew.json");
const listingUpdateSchema = require("../schemas/listingUpdate.json");
// const listingSearchSchema = require("../schemas/listingSearch.json");

// Multer middleware for handling multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = new express.Router();

/** POST / { listing } =>  { listing }
 *
 * listing must contain be { host_user,
 *                           price,
 *                           description,
 *                           photo_url,
 *                           city,
 *                           state,
 *                           zipcode,
 *                           address
 *                         }
 *
 * Returns { listing_id,
 *           host_user,
 *           price,
 *           description,
 *           photo_url,
 *           city,
 *           state,
 *           zipcode,
 *          }
 *
 * Authorization required: token (registered user)
 */

router.post(
  "/",
  ensureLoggedIn,
  upload.single("photo"),
  async function (req, res, next) {
    const validator = jsonschema.validate(req.body, listingNewSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    // Call the uploadPhoto helper function and add the returned URL to the request body
    try {
      const uploadedImage = await uploadPhoto(
        req.file.buffer,
        req.file.originalname
      );
      if (uploadedImage && uploadedImage.photo_url) {
        req.body.photo_url = uploadedImage.photo_url;
      }
    } catch (error) {
      return next(error);
    }

    const listing = await Listing.create(req.body);
    return res.status(201).json({ listing });
  }
);

/** GET /  =>
 * [{ listing_id,
 *           host_user,
 *           price,
 *           description,
 *           photo_url,
 *           city,
 *           state,
 *           zipcode,
 *          }...]
 *
 * Can filter on any of the above value
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;

  const listings = await Listing.findAll(q);
  return res.json({ listings });
});

/** GET listings by listing_id:
 *
 * /[username]  =>  { listing... }
 *
 * Returns: [ { listing_id,
 *              price,
 *              description,
 *              photo_url
 *            }...
 *          ]
 *
 * Authorization required: none
 */

router.get("/:listing_id", async function (req, res, next) {
  console.log("RESPONSE FROM GET LISTING ROUTE ===>", req.params.listing_id)
  const listing = await Listing.getListId(req.params.listing_id);
  return res.json({ listing });
});

/** PATCH /[listing_id] { fld1, fld2, ... } => { listing }
 *
 * Patches listing data.
 *
 * fields can be: { name, description, photo_url }
 *
 * Returns {listing_id,
 *           host_user,
 *           price,
 *           description,
 *           photo_url,
 *           city,
 *           state,
 *           zipcode,
 *         }
 *
 * Authorization required: authorized user + owner
 */

router.patch("/:listing_id",  async function (req, res, next) {
  const validator = jsonschema.validate(req.body, listingUpdateSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  const listing = await Listing.update(req.params.listing_id, req.body);
  if ( req.params.username === listing.host_id) {

  return res.json({ listing })
  }
  throw new UnauthorizedError(errs);
});

/** DELETE /[listing_id]  =>  { deleted: listing_id }
 *
 * Authorization: admin
 */

router.delete(
  "/:listing_id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    await Listing.remove(req.params.listing_id);
    return res.json({ deleted: req.params.listing_id });
  }
);

module.exports = router;
