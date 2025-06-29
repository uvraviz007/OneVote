const express = require('express')
const app = express();
// const db = require('./db');
const {connectDB} = require('./db');
require('dotenv').config();
const userRoutes = require('./routes/user.route.js');
const candidateRoutes = require('./routes/candidate.route.js');
const cors = require('cors'); 
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

connectDB();

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET_KEY
});

app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use(cors({
  origin: 'http://localhost:3000', // or 5173 if you're using Vite
  credentials: true
}));

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 5000;

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

//just for example

// Import the router files

app.get('/', (req,res)=>{
    // console.log("welcome to voting machine");
    res.send("welocme to 5th election fare");
});

// Use the routers

app.listen(PORT, ()=>{
    console.log('listening on port', PORT);
})