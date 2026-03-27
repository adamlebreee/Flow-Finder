const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/Yoga';

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.error('Error connecting to DB', err);
    });
