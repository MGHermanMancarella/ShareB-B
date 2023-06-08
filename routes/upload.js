'use strict';

const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// Multer middleware for handling multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Generate random UUID for photo upload
const randomUUID = uuidv4();

// POST route for uploading a single photo
router.post('/', upload.single('photo'), async function (req, res, next) {
  try {
    const s3data = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${randomUUID}_${req.file.originalname}`,
      Body: req.file.buffer,
    };
    const uploadedImg = await s3.upload(s3data).promise();

    res.send('Successfully uploaded ' + req.file.originalname);
  } catch (err) {
    console.error('Error uploading photo:', err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

module.exports = router;





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
