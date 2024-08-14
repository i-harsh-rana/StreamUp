import express from 'express';
import connectDB from './db/index.db.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config({
    path: './.env'
});

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Listening....");
    });
})
.catch((error) => {
    console.log("Error in Port: ", error);
});
