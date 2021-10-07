module.exports = (req, res, next) => {
  const { isAdmin, isSuperAdmin } = req.user;
  if (!isAdmin && !isSuperAdmin) return res.status(403).send('Access denied.');

  next();
};
