const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const MusicModel = require('../db/models/music');

// Initialize Google Cloud Storage
const storage = new Storage();
const audioBucket = storage.bucket('welton-music');
const imageBucket = storage.bucket('welton-music-images');

// Configure multer for file uploads
const upload = multer();

// Route to handle file uploads
router.post(
  '/upload',
  upload.fields([
    { name: 'previewImage', maxCount: 1 },
    { name: 'audioFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Extract data from the form fields
      const {
        id,
        title,
        subtitle,
        description,
        tags,
        gumroadLink,
        isCommissioned,
        commissionedBy,
        instrumentation,
        duration,
      } = req.body;

      // Handling audio file upload
      const audioFile = req.files['audioFile'][0];
      const audioBlobName =
        Date.now() + '-' + path.basename(audioFile.originalname);
      const audioBlob = audioBucket.file(audioBlobName);
      const audioBlobStream = audioBlob.createWriteStream();
      audioBlobStream.on('error', (error) => {
        console.error('Error uploading audio file:', error);
        res.status(500).json({ error: 'Failed to upload audio file' });
      });
      audioBlobStream.on('finish', async () => {
        // Handling image file upload
        const imageFile = req.files['previewImage'][0];
        const imageBlobName =
          Date.now() + '-' + path.basename(imageFile.originalname);
        const imageBlob = imageBucket.file(imageBlobName);
        const imageBlobStream = imageBlob.createWriteStream();
        imageBlobStream.on('error', (error) => {
          console.error('Error uploading image file:', error);
          res.status(500).json({ error: 'Failed to upload image file' });
        });
        imageBlobStream.on('finish', async () => {
          // Save the file information to the MongoDB database
          try {
            const musicData = await MusicModel.create({
              id: parseInt(id),
              title,
              subtitle,
              description,
              previewImage: `https://storage.googleapis.com/${imageBucket.name}/${imageBlobName}`,
              audioFileName: audioBlobName,
              tags: tags.split(',').map((tag) => tag.trim()),
              gumroadLink,
              isCommissioned: isCommissioned === 'true',
              commissionedBy:
                isCommissioned === 'true' ? commissionedBy : undefined,
              instrumentation,
              duration,
            });
            res.json(musicData);
          } catch (error) {
            console.error('Error saving file to database:', error);
            res.status(500).json({ error: 'Failed to save file information' });
          }
        });

        // Pipe the image file stream to the bucket's writable stream
        fs.createReadStream(imageFile.path).pipe(imageBlobStream);
      });

      // Pipe the audio file stream to the bucket's writable stream
      fs.createReadStream(audioFile.path).pipe(audioBlobStream);
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
