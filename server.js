const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/talkie', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log("DB connected"));

app.use(express.json());
app.use(cors());

const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

app.listen(process.env.PORT || 3000);


