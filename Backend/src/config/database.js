const mongoose = require('mongoose');

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');
  } catch(err) {
    console.error('Fatal Error: Failed to connect to database', err);
    process.exit(1);
  }
}

module.exports = connectToDB;
