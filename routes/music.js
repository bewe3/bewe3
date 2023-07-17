const express = require('express');
const router = express.Router();
const MusicModel = require('../db/models/music');

// Route to fetch all music data
router.get('/', async (req, res) => {
  try {
    const musicData = await MusicModel.getAllMusicData();
    res.json(musicData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
