require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/talkie', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log("DB connected"));

app.use(express.json());

const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

app.listen(3000, () => {
    console.log("Server is running");
});