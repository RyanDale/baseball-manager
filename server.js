require('dotenv').config();

const express = require('express');

const connectToDB = require('./utils/connectToDB');

const app = express();
const port = process.env.PORT;

app.use(express.json());

connectToDB();

app.use('/api/hitters', require('./routes/hitters'));
app.use('/api/pitchers', require('./routes/pitchers'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (request, response) => {
        response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server started on: ${port}`);
});
