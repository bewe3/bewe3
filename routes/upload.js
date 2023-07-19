const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ObjectId } = require('mongodb');
const connect = require('../db/connect');
const { getAllMusicData } = require('../db/models/music');

const dotenv = require('dotenv');
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/upload',
  upload.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        subtitle,
        description,
        tags,
        gumroadLink,
        isCommissioned,
        commissionedBy,
      } = req.body;
      const audioFile = req.files['audioFile'][0];
      const imageFile = req.files['imageFile'][0];

      // Validate required fields
      if (
        !title ||
        !subtitle ||
        !description ||
        !tags ||
        !gumroadLink ||
        !audioFile ||
        !imageFile
      ) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Optional field validation
      if (isCommissioned && !commissionedBy) {
        return res.status(400).json({
          error: 'Commissioned by is required when isCommissioned is true',
        });
      }

      const db = connect.getDb();
      const musicCollection = db.collection('music');

      // Save the files to Google Cloud Storage and get their URLs
      // Your implementation for uploading to Google Cloud Storage goes here

      // Save the data to MongoDB
      const musicData = {
        title,
        subtitle,
        description,
        previewImage: 'image_file_url_here', // Replace with the image file URL
        audioFileName: 'audio_file_url_here', // Replace with the audio file URL
        tags: tags.split(',').map((tag) => tag.trim()), // Convert tags string to array
        gumroadLink,
        isCommissioned: Boolean(isCommissioned),
        instrumentation: '', // Add any relevant data for the instrumentation field
        commissionedBy: commissionedBy || '', // Optional field, default to empty string if not provided
        duration: '', // Add any relevant data for the duration field
      };

      const result = await musicCollection.insertOne(musicData);
      if (result.insertedCount === 1) {
        const allMusicData = await getAllMusicData(); // Assuming you have a function to fetch all music data
        return res.status(200).json(allMusicData);
      } else {
        return res
          .status(500)
          .json({ error: 'Failed to insert data into the database' });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      return res
        .status(500)
        .json({ error: 'Upload failed. Please try again.' });
    }
  }
);

module.exports = router;
