const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const userRoutes = require('./routes/user.route.js');
const candidateRoutes = require('./routes/candidate.route.js');


const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;


app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


//just for example


// Import the router files


app.get('/', (req,res)=>{
    console.log("welcome to voting machine");
    res.send("welocme to 5th election fare");
});

// Use the routers



app.listen(PORT, ()=>{
    console.log('listening on port', PORT);
})