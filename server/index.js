require("dotenv").config();
const mongoose = require('mongoose');
// const genres = require('./routes/genres');
// const customers = require('./routes/customers');
// const movies = require('./routes/movies');
const users = require('./routes/users');
// const auth = require('./routes/auth');
const express = require('express');
const app = express();

mongoose.connect(process.env.DATABASE)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

if(process.env.SECRET == null || undefined){
  console.error("Fetal error Jwt private key is not defined");
  process.exit(1);
}
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
// app.use('/api/genres', genres);
// app.use('/api/customers', customers);
// app.use('/api/movies', movies);
app.use('/api/users', users);
// app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));