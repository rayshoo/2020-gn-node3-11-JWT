const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../modules/auth');

const pool = require('../modules/mysql-conn');
const { v4: uuid4 } = require('uuid');

router.post('/save', async (req, res, next) => {
  const { domain, userid } = req.body;
  let connect, sql, sqlValues, result;

  try {
    connect = await pool.getConnection();
    sql = 'SELECT * FROM apikey WHERE domain=? AND userid=?';
    sqlValues = [domain, userid];
    result = await connect.execute(sql, sqlValues);

    if (result[0][0]) {
      connect.release();
      res.json(result[0][0]);
      return;
    }

    sql = 'INSERT INTO apikey SET domain=?, api_key=?, userid=?';
    sqlValues = [domain, uuid4(), userid];
    result = await connect.execute(sql, sqlValues);

    sql = 'SELECT * FROM apikey WHERE id=?';
    sqlValues = [result[0].insertId];
    result = await connect.execute(sql, sqlValues);
    connect.release();
    res.json(result[0][0]);
  } catch (err) {
    connect.release();
    console.error(err);
    next(err);
  }
});

router.post('/sign', async (req, res, next) => {
  let connect, result, sql, sqlValues;
  let { userid, domain, api_key } = req.body;
  try {
    connect = await pool.getConnection();
    sql = 'SELECT * FROM apikey WHERE userid=?, domain=?, api_key=?';
    sqlValues = [userid, domain, api_key];

    result = await connect.execute(sql, sqlValues);
    if (result[0][0]) {
      const token = jwt.sign(
        {
          id: 'qwf',
        },
        process.env.JWT_SALT,
        {
          expiresInt: '1m',
        },
      );

      return res.json({
        code: 200,
        message: '토큰이 발급되었습니다.',
        token,
      });
    }
  } catch (err) {}
});

router.get('/data', verifyToken, (req, res, next) => {});

module.exports = router;
