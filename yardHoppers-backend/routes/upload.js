"use strict";

/** Routes for s3 upload. */
const express = require(`express`);
const AWS = require(`aws-sdk`);
const multer = require(`multer`);
const storage = multer.memoryStorage()
const upload = multer({ storage });

const router = new express.Router();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});
const s3 = new AWS.S3();
// console.log("s3 ===", s3);
// console.log("s3.upload", s3.upload);

// Multer middleware for handling multipart/form-data

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.BUCKET_NAME,
//     acl: `public-read`,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });
console.log("upload ===>", upload);
3;
// POST route for uploading single photo
router.post(`/`, upload.single(`photo`), 
async function (req, res, next) {
  console.log("entered .post");
  console.log('s3Data verification', req.file.originalname,
  req.file.buffer)
  const s3data = {
    Bucket: process.env.BUCKET_NAME,
    Key: toString(uuid()) + req.file.originalname ,
    Body: req.file.buffer
  };
  const uploadedImg = await s3.upload(s3data).promise();
  console.log("uploadedImg====", uploadedImg.Location);
  res.send(`Successfully uploaded ` + req.file.originalname);
});

// app.listen(3001, function () {
//   console.log(`Server listening on port 3001!`);
// });

module.exports = router;
