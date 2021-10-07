const jwt = require('jsonwebtoken');

const Session = require('../models/session');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;

    const session = await Session.findOne({ username: decoded.username });
    if (!session || session.token !== token)
      return res.status(400).send('Invalid token');

    next();
  } catch (ex) {
    res.status(400).send('Invalid token');
  }
};
