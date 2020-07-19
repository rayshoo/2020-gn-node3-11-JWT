const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const fs = require('fs');

require('dotenv').config();

const tokenRouter = require('./routes/token');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.pretty = true;
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger('common', { stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) }));

app.get('/', (req, res, next) => {
  res.render('index.pug');
});
app.use('/token', tokenRouter);

app.listen(3000, () => {
  console.log('server started at http://127.0.0.1:3000');
});
