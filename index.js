require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection URI
// const mongoURI = 'mongodb://localhost:27017';
const PORT = process.env.PORT || 3000; // Corrected 'port' variable to 'PORT'

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const loginSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const login = mongoose.model('login', loginSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')); // For serving static files
app.use(express.urlencoded({ extended: true }));

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle login form submission
app.post('/', (req, res) => {
  var myData = new login(req.body);
  myData
    .save()
    .then(() => {
      res.send('This item has been saved to the database');
    })
    .catch(() => {
      res.status(400).send('Item was not saved to the database');
    });
});

// Validate the email and password
// Commenting out this block since it's not necessary for the current implementation.

// const connectDB = async() => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   }
//   catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// }

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});

// Start the server
// Commenting out this block since the server is already started in the connectDB() function.

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
