import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
dotenv.config()
const port = process.env.PORT || 3000;
const uri=process.env.MONGO_URI

app.use(express.json())

try{
    await mongoose.connect(uri);
    console.log("Connected to DataBase")
} catch (error){
    console.log(error)
}

app.listen(port, () => {
  console.log(`Sever listening on port ${port}`)
})