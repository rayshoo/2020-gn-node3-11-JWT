const express = require('express');
const app = express();
const path = require('path');
const router = require('../server/routes/token');
const { default: Axios } = require('axios');
const pool = require('../server/modules/mysql-conn');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.pretty = true;
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/data', async (req, res, next) => {
  if (!req.session.jwt) {
    const tokenResult = await Axios.post('http://127.0.0.1:3000/token/sign', {
      api_key: '342e5ef0-10ce-47e0-9d60-f70efcde040e',
      domain: 'localhost:3001',
      userid: 'qwf',
    });
    req.session.jwt = tokenResult.data.token;
  }
  const dataResult = await Axios.get('http://127.0.0.1:3000/token/data', {
    headers: { authorization: req.session.jwt },
  });
});

app.listen(3001, () => {
  console.log('server started at http://127.0.0.1:3001');
});
