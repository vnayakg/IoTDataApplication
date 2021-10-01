module.exports = (err, req, res, next) => {
  console.log('\nERROR:----------------------\n', err);
  res.status(500).send('Something failed');
};
