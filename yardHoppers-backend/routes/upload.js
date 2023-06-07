"use strict";

/** Routes for s3 upload. */

const express = require(`express`);
const AWS = require(`aws-sdk`);
const multer = require(`multer`);
const multerS3 = require(`multer-s3`);
const app = express();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});
const s3 = new AWS.S3();

// Multer middleware for handling multipart/form-data
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: `public-read`,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

// POST route for uploading single photo
app.post(`/`, upload.single(`photo`), function (req, res, next) {
  res.send(`Successfully uploaded ` + req.file.originalname);
});

// app.listen(3001, function () {
//   console.log(`Server listening on port 3001!`);
// });
