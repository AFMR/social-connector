const express = require('express');
const app = express();
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser');

//Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB config
const db = require ('./Keys').mongoURI

//Conect to mongoDB
mongoose
.connect(db)
.then(()=> console.log('MongoDB connected'))
.catch(err => console.log(err));

//first route
app.get('/', (req, res) => res.send('Hello world'));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
