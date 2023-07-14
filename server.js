const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to and listening on ${port}`);
    });
  }
});