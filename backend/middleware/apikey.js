module.exports = (req, res, next) => {
  const key = req.header('x-api-key');

  if (!key) return res.status(401).send('Access denied. No API key provided');

  if (key !== process.env.IOT_API_KEY)
    return res.status(400).send('Invalid API key');

  next();
};
