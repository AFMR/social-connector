const express = require('express');
const app = express();
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser');
const passport = require('passport');


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

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);