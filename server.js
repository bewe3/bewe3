const express = require('express');
const path = require('path');
const musicRoutes = require('./routes/music');
const uploadRoutes = require('./routes/upload');
const mongodb = require('./db/connect');

const app = express();
const port = process.env.PORT || 8080;

// Step 1: Serve files from the root directory
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/music', musicRoutes);
app.use('/upload', uploadRoutes);

mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to and listening on ${port}`);
    });
  }
});

// Step 2: Serve the index.html file for the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
