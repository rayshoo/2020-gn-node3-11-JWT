const verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SALT);
    if (req.decoded) next();
  } catch (err) {
    console.error(err);
  }
};

module.exports = verifyToken;
