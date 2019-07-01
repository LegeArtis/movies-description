const express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path'),
  port = 3000,
  mongoose = require('mongoose');

const app = express();

const route = require('./routes');

app.listen(port, () => {
  console.log('Server is running at port:' + port);
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('', route);


mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://user:1111@gym-vygqe.mongodb.net/GYM?retryWrites=true', { useNewUrlParser: true}).then(
  () => {console.log('Database is connected')},
  err => {console.log('Can not connect to the database ' + err)}
);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
