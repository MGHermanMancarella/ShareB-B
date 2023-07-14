"use strict";

const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

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

// helper function for uploading a single photos
/** */
async function uploadPhoto(fileBuffer, originalName) {
  try {
    const s3data = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}_${originalName}`,
      Body: fileBuffer,
      ContentType: originalName,
    };
    const uploadedImg = await s3.upload(s3data).promise();

    return ({ photo_url: uploadedImg.Location });
  } catch (err) {
    console.error('Error uploading photo:', err);
    throw new BadRequestError('Failed to upload photo');
  }

}

module.exports = {uploadPhoto};

const searchablecontent = {
	"listings": [
		{
			"listing_id": 1,
			"host_user": "user5",
			"price": 100,
			"city": "City1",
			"state": "State1",
			"zipcode": "12345",
			"description": "Salvia meggings plaid man bun poke squid keytar paleo pug same unicorn skateboard asymmetrical vexillologist.",
			"photo_url": "photo1.jpg"
		},
		{
			"listing_id": 2,
			"host_user": "user7",
			"price": 200,
			"city": "City2",
			"state": "State2",
			"zipcode": "23456",
			"description": "Banjo venmo intelligentsia man braid la croix before they sold out YOLO pinterest",
			"photo_url": "photo2.jpg"
		},
		{
			"listing_id": 3,
			"host_user": "user10",
			"price": 150,
			"city": "City3",
			"state": "State3",
			"zipcode": "34567",
			"description": "Pickled tonx chartreuse,trust fund pop-up hot chicken post-ironic selvage 8-bit schlitz",
			"photo_url": "photo3.jpg"
		},
		{
			"listing_id": 4,
			"host_user": "user13",
			"price": 180,
			"city": "City1",
			"state": "State1",
			"zipcode": "12345",
			"description": "Tonx helvetica mumblecore typewriter,readymade PBR&B polaroid taiyaki DIY deep v",
			"photo_url": "photo4.jpg"
		},
		{
			"listing_id": 5,
			"host_user": "user16",
			"price": 250,
			"city": "City4",
			"state": "State4",
			"zipcode": "45678",
			"description": "Shabby chic bitters iPhone, yuccie adaptogen shaman dreamcatcher etsy lo-fi fam chartreuse taiyaki umami squid.",
			"photo_url": "photo5.jpg"
		},
		{
			"listing_id": 6,
			"host_user": "user16",
			"price": 300,
			"city": "City2",
			"state": "State2",
			"zipcode": "23456",
			"description": "Lorem ipsum dolor sit amet consectetur adipiscing elit",
			"photo_url": "photo6.jpg"
		},
		{
			"listing_id": 8,
			"host_user": "mikey",
			"price": 2000,
			"city": "San Francisco",
			"state": "California",
			"zipcode": "01234",
			"description": "The curb out front is freshly swept!",
			"photo_url": "https://s3.us-west-1.amazonaws.com/yard.hoppers/3e9ace63-b442-4091-a074-16ecdf658210_depositphotos_3995516-stock-photo-cracked-urban-sidewalk.jpg"
		},
		{
			"listing_id": 9,
			"host_user": "mikey",
			"price": 2100,
			"city": "San Francisco",
			"state": "California",
			"zipcode": "01234",
			"description": "The squirrels are a little too brave. We have a couple extra garbage can lids but you should really bring your own",
			"photo_url": "https://s3.us-west-1.amazonaws.com/yard.hoppers/81d4c45f-ff20-40da-b83d-7a53ae197cc3_DSCF6244.JPG"
		},
		{
			"listing_id": 11,
			"host_user": "mikey",
			"price": 12,
			"city": "San Francisco",
			"state": "California",
			"zipcode": "01234",
			"description": "In a past life I was a Nepali sherpa. I was murdered by a European man who hired me to navigate the Kangchenjunga summit. We have pool noodles that you are free to use.",
			"photo_url": "https://s3.us-west-1.amazonaws.com/yard.hoppers/4ee69d6e-e807-4ed9-9070-38af374f1164_david-netto-connecticut-pool-1591917883.jpg"
		},
		{
			"listing_id": 12,
			"host_user": "mikey",
			"price": 123,
			"city": "San Francisco",
			"state": "California",
			"zipcode": "01234",
			"description": "The squirrels are a little too brave. We have a couple extra garbage can lids but you should really bring your own",
			"photo_url": "https://s3.us-west-1.amazonaws.com/yard.hoppers/81d4c45f-ff20-40da-b83d-7a53ae197cc3_DSCF6244.JPG"
		}
	]
}
