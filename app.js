require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URI
// const mongoURI = 'mongodb://localhost:27017';
const port = process.env.PORT || 3000;

mongoose.set('strictQuery', false);
const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }
  catch (error) {
    console.log(error);
    process.exit(1);
  }
}


const loginSchema = new mongoose.Schema({
    email: String,
    password: String,
  });
  
const login = mongoose.model( 'login', loginSchema);

// EXPRESS SPECIFIC STUFF   
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded({ extended: true }));

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// Handle login form submission
app.post("/", (req, res) => {
    var myData = new login(req.body);
    myData.save().then(() => {
      res.send("This item has been saved to the database")
    }).catch(() => {
      res.status(400).send("item was not saved to the database")
    });
  })

//   // Validate the email and password
//   if (email === 'user@example.com' && password === 'password123') {
//     res.send('Login successful!');
//   } else {
//     res.send('Invalid email or password. Please try again.');
//   }
// });

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

connectDB().then(() =>{
  app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`);
  })
});

// Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
