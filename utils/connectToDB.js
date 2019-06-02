require('dotenv').config();

const mongoose = require('mongoose');


module.exports = function() {
    return mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true
    }).catch(err => {
        console.log('Error connecting to MongoDB', err);
    });
}