const { ObjectId } = require('mongodb');
const connect = require('../connect'); // Import the connect.js file

const collectionName = 'music';

// Function to fetch all music data from the "music" collection
async function uploadMusic() {
  try {
    const db = connect.getDb(); // Get the MongoDB connection instance from connect.js
    const collection = db.collection(collectionName);
    const musicData = await collection.find({}).toArray();
    return musicData;
  } catch (error) {
    console.error('Failed to fetch data from the "music" collection:', error);
    throw error;
  }
}

module.exports = {
  uploadMusic,
};
