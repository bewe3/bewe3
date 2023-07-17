const express = require('express');
const path = require('path');
const musicRoutes = require('./routes/music');
const mongodb = require('./db/connect');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/music', musicRoutes);

mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to and listening on ${port}`);
    });
  }
});
