
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());


const routes = require('./routes');
app.use('/', routes);


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env file');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = app;
