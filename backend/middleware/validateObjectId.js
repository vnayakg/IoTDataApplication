const mongoose = require('mongoose');

// param (string) is name of route parameter containing ObjectId
module.exports = (param) => {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[param]))
      return res.status(404).send('Invalid ID');

    next();
  };
};
