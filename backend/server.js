import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

app.use(express.json());

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to DataBase");
  } catch (error) {
    console.log(error);
  }
})();

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/users', userRoute);

app.listen(port, () => {
  console.log(`Sever listening on port ${port}`);
});